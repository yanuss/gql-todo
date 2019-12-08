import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Header from "../Header/Header";
import Meta from "../Meta/Meta";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDarkMode } from "../userDarkMode";
import useLayoutEffect from "../../lib/use-isomorphic-layout-effect";

import useMediaQuery from "@material-ui/core/useMediaQuery";

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: 0
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: drawerWidth
    }
  })
);

const Page = props => {
  const [palette, togglePalette, componentMounted] = useDarkMode();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const selectedDarkmode = componentMounted && palette === "dark";
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const theme = React.useMemo(() => {
    // if (componentMounted) {
    return createMuiTheme({
      palette: {
        type: selectedDarkmode ? "dark" : "light"
      }
    });
    // }
  }, [prefersDarkMode, selectedDarkmode]);

  useLayoutEffect(() => {
    console.log("hello there");
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Meta />
      <Header
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        open={open}
        palette={palette}
        togglePalette={togglePalette}
      />
      {/* <body> */}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        {props.children}
      </main>
      {/* </body> */}
    </ThemeProvider>
  );
};

export default Page;
