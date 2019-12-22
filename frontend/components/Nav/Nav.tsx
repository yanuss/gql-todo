import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
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
import User, { useUser } from "../User/User";

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
    },
    loader: {
      color: green[500]
    }
  })
);

const Nav = (props: any) => {
  const classes = useStyles();
  const { data } = useUser();

  return (
    <div className={classes.nav}>
      <AppBar
        position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.open
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
            ToDo list
          </Typography>
          <div className={classes.sideContainer}>
            <ToggleDarkModeButton togglePalette={props.togglePalette} />
            <User>
              {(data?: object, loading?: boolean) => {
                if (loading) return <CircularProgress size={34} />;
                return (
                  <AvatarMenu data={data} togglePalette={props.togglePalette} />
                );
              }}
            </User>
          </div>
        </Toolbar>
      </AppBar>
      <SideMenu {...props} />
    </div>
  );
};
export default Nav;
