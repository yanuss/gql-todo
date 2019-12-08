import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
// import theme from '../src/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};

// import React from "react";
// import NextDocument from "next/document";
// // import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
// import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/styles";

// export default class Document extends NextDocument {
//   static async getInitialProps(ctx) {
//     // const styledComponentSheet = new StyledComponentSheets();
//     const materialUiSheets = new MaterialUiServerStyleSheets();
//     const originalRenderPage = ctx.renderPage;

//     try {
//       ctx.renderPage = () =>
//         originalRenderPage({
//           enhanceApp: App => props =>
//             // styledComponentSheet.collectStyles(
//             materialUiSheets.collect(<App {...props} />)
//           // )
//         });

//       const initialProps = await NextDocument.getInitialProps(ctx);

//       return {
//         ...initialProps,
//         styles: [
//           <React.Fragment key="styles">
//             {initialProps.styles}
//             {materialUiSheets.getStyleElement()}
//             {/* {styledComponentSheet.getStyleElement()} */}
//           </React.Fragment>
//         ]
//       };
//     } finally {
//       // styledComponentSheet.seal();
//     }
//   }
// }
