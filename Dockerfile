FROM --platform=linux/amd64 node:18-alpine AS build

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/app

COPY ./package.json					./
COPY ./tsconfig.json				./
COPY ./yarn.lock					./

COPY ./next.config.js 				./

COPY ./utils						./utils
COPY ./styles						./styles
COPY ./schema						./schema
COPY ./server						./server
COPY ./public						./public
COPY ./prisma						./prisma
COPY ./pages						./pages
COPY ./components					./components

RUN yarn install

# WORKDIR /usr/app/

ARG TAG
ENV NEXT_PUBLIC_VERSION=$TAG

RUN yarn prisma:generate \
	&& yarn build \
	&& mkdir /usr/app/build \
	&& cp -r .next /usr/app/build \
	&& cp -r public /usr/app/build/public \
	&& cp -r ./next.config.js /usr/app/build/next.config.js
	# && cp -r .env.production /usr/app/build/.env.production	 \
	# && yarn prod-install /usr/app/build \
	# && chmod 777 /usr/app/build/.yarn/install-state.gz

### PRODUCTION
FROM --platform=linux/amd64 node:18-alpine
WORKDIR /usr/app

COPY --from=build /usr/app/build ./

COPY --from=build /usr/app/next.config.js ./
COPY --from=build /usr/app/public ./public
COPY --from=build /usr/app/.next ./.next
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/package.json ./package.json

ENV TZ Europe/Prague

RUN apk add --no-cache tzdata \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN chmod 777 /usr/app/.next/cache/

USER 1000:1000
CMD ["yarn", "prod"]