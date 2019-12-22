import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Header from "../Header/Header";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDarkMode } from "../../lib/useDarkMode";

export const drawerWidth = 150;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: "flex",
      justifyContent: "center",
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

const Page = (props: any) => {
  const classes = useStyles();
  const { palette, togglePalette, theme } = useDarkMode();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Header
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        open={open}
        palette={palette}
        togglePalette={togglePalette}
      />
      <CssBaseline />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        {props.children}
      </main>
    </ThemeProvider>
  );
};

export default Page;
