import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import { drawerWidth } from "../Page/Page";
import SideMenu from "../SideMenu/SideMenu";
import ToggleDarkModeButton from "../ToggleDarkModeButton/ToggleDakrModeButton";
import SwipeDrawer from "../SwipeDrawer/SwipeDrawer";
import useWindowDimensions from "../../lib/useWindowDimensions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nav: {
      flexGrow: 1
    },
    root: {},
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    sideContainer: {
      display: "flex",
      alignItems: "center",
      "& > *": {
        marginLeft: theme.spacing(2)
      }
    }
  })
);

const Nav = (props: any) => {
  const { width } = useWindowDimensions();
  const classes = useStyles();

  return (
    <div className={classes.nav}>
      <AppBar
        position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.open && width && width > 500
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={props.handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Todo list
          </Typography>
          <div className={classes.sideContainer}>
            <ToggleDarkModeButton togglePalette={props.togglePalette} />
            <AvatarMenu togglePalette={props.togglePalette} />
          </div>
        </Toolbar>
      </AppBar>
      {width && width > 500 ? (
        <SideMenu {...props} />
      ) : (
        <SwipeDrawer {...props} />
      )}
    </div>
  );
};
export default Nav;
