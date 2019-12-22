import React from "react";
import Nav from "../Nav/Nav";
// import Router from "next/router";
// import NProgress from "nprogress";

// Router.events.on("routeChangeStart", () => {
//   // console.log("routeChangeStart");
//   NProgress.start();
// });

// Router.events.on("routeChangeComplete", () => {
//   // console.log("routeChangeComplete");
//   NProgress.done();
// });

// Router.events.on("routeChangeError", () => {
//   // console.log("routeChangeError");
//   NProgress.done();
// });

interface Props {
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  open: boolean;
  palette: string;
  togglePalette: () => void;
}

const Header: React.FC<Props> = props => {
  return (
    <div>
      <Nav {...props} />
    </div>
  );
};

export default Header;
