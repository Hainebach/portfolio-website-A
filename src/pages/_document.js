import { Html, Head, Main, NextScript } from "next/document";
import { ptSerif } from "../lib/fonts";

export default function Document() {
  return (
    <Html lang="en" className={ptSerif.variable}>
      <Head>
        {/* Default favicon - will be overridden by page-specific SEO */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={ptSerif.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
