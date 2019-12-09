import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SideMenu from "../SideMenu/SideMenu";
import clsx from "clsx";
import { drawerWidth } from "../Page/Page";
import Avatar from "@material-ui/core/Avatar";
import User from "../User/User";
import CircularProgress from "@material-ui/core/CircularProgress";
import Signout from "../Signout/Singout";
import Link from "next/link";
import AvatarMenu from "../AvatarMenu/AvatarMenu";

const NavWrapper = styled.nav`
  flex-grow: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    }
  })
);

const Nav = props => {
  const classes = useStyles();

  return (
    <NavWrapper>
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
          <User>
            {(data, loading) => {
              if (loading) return <CircularProgress size={34} />;
              if (data && data.me) {
                return (
                  <AvatarMenu data={data} togglePalette={props.togglePalette} />
                );
              } else {
                return (
                  <Link href="/signin" passHref>
                    <Button component="a">Login</Button>
                  </Link>
                );
              }
            }}
          </User>
        </Toolbar>
      </AppBar>
      <SideMenu {...props} />
    </NavWrapper>
  );
};
export default Nav;
