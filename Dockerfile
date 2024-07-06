### BUILD
FROM node:18-alpine AS build

WORKDIR /usr/app

COPY ./.yarn/cache			./.yarn/cache
COPY ./.yarn/plugins		./.yarn/plugins
COPY ./.yarn/releases		./.yarn/releases
COPY ./.yarnrc.yml			./
COPY ./package.json			./
COPY ./tsconfig.base.json	./
COPY ./yarn.lock			./

COPY ./packages/client 						./packages/client
COPY ./packages/api 						./packages/api
COPY ./packages/shared						./packages/shared
COPY ./packages/db							./packages/db

RUN yarn install

RUN yarn workspace @ape-mail/shared build

RUN echo "PRISMA" && cat ./packages/api/package.json/package.json | sed -i 's/..\/db\/prisma\/schema.prisma/schema.prisma/g' ./packages/api/package.json
RUN yarn workspace @ape-mail/api prisma:generate
RUN yarn workspace @ape-mail/api build:types

RUN yarn workspace @ape-mail/client build

WORKDIR /usr/app/packages/api

RUN echo "PRISMA" && cat package.json | sed -i 's/..\/db\/prisma\/schema.prisma/schema.prisma/g' ./package.json
RUN yarn prisma:generate
RUN yarn build
RUN mkdir /usr/app/build
RUN cp -r dist /usr/app/build
RUN  cp -r schema.prisma /usr/app/build/schema.prisma
RUN yarn prod-install /usr/app/build
RUN chmod 777 /usr/app/build/.yarn/install-state.gz


# shared lib CLEAN
RUN rm -rf /usr/app/build/node_modules/@ape-mail/shared
RUN mkdir -p /usr/app/build/node_modules/@ape-mail/shared
RUN cp -r /usr/app/packages/shared/ /usr/app/build/node_modules/@ape-mail

COPY ./packages/api/tsconfig.prod.json						/usr/app/build

### PRODUCTION
FROM node:18-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/build ./
COPY --from=build /usr/app/packages/client/dist 	./client

ENV TZ Europe/Prague

RUN apk add --no-cache tzdata \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk add fontconfig

USER 1000:1000
CMD [ "sh", "-c", "TS_NODE_PROJECT=./tsconfig.prod.json node -r tsconfig-paths/register ./dist/main.js" ]