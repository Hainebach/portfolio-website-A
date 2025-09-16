import { Html, Head, Main, NextScript } from "next/document";
import { ptSerif } from "../lib/fonts";

export default function Document() {
  return (
    <Html lang="en" className={ptSerif.variable}>
      <Head />
      <body className={ptSerif.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
