import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";
import { ptSerif } from "../../public/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>{/* PT Serif is now loaded via Next.js fonts in _app.js */}</Head>
      <body className={ptSerif.variable}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
