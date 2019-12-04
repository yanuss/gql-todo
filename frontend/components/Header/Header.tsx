import React from "react";
import Link from "next/link";
import Nav from "../Nav/Nav";
import Router from "next/router";
import NProgress from "nprogress";
import CircularProgress from "@material-ui/core/CircularProgress";

Router.events.on("routeChangeStart", () => {
  console.log("routeChangeStart");
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  console.log("routeChangeComplete");
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  console.log("routeChangeError");
  NProgress.done();
});

const Header = props => {
  return (
    <div>
      <Nav {...props} />
    </div>
  );
};

export default Header;
