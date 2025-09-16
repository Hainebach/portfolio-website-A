import { Html, Head, Main, NextScript } from "next/document";
import { ptSerif } from "../../public/fonts";

export default function Document() {
  return (
    <Html lang="en" className={ptSerif.variable}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
