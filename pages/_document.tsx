import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => (
	<Html lang="en">
		<Head>
			<link rel="icon" type="image/x-icon" href="/favicon.ico" />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;600;700;800&display=swap"
				rel="stylesheet"
			/>
			<meta name="description" content="tRPC Next.js Prisma Chakra UI TypeScript Todo content" key="desc" />
			<meta property="og:title" content="tRPC Next.js Prisma Chakra UI TypeScript Todo" />
			<meta property="og:description" content="tRPC Next.js Prisma Chakra UI TypeScript Todo App" />
			<meta property="og:image" content="https://example.com/images/cool-page.jpg" />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const cache = createCache();
	const originalRenderPage = ctx.renderPage;
	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: App => props => (
				<StyleProvider cache={cache}>
					<App {...props} />
				</StyleProvider>
			),
		});

	const initialProps = await Document.getInitialProps(ctx);
	const style = extractStyle(cache, true);
	return {
		...initialProps,
		styles: (
			<>
				{initialProps.styles}
				<style dangerouslySetInnerHTML={{ __html: style }} />
			</>
		),
	};
};

export default MyDocument;
