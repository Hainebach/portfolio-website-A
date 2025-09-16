import { Html, Head, Main, NextScript } from "next/document";
import { ptSerif } from "../lib/fonts";

export default function Document() {
  return (
    <Html lang="en" className={ptSerif.variable}>
      <Head>
        {/* Basic meta tags - favicon will be overridden by SEOHead component */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Fallback favicon - will be replaced by Contentful favicon when available */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <body className={ptSerif.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
