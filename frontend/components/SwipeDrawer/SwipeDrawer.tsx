import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { useUser } from "../User/User";
import List from "@material-ui/core/List";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import Link from "next/link";

const useStyles = makeStyles({
  list: {
    width: "auto"
  },
  icon: {
    width: "32px"
  }
});

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const SwipeDrawer = (props: any) => {
  const { data } = useUser();
  const classes = useStyles();
  const me = data && data.me;
  return (
    <SwipeableDrawer
      open={props.open}
      onClose={props.handleDrawerClose}
      onOpen={props.handleDrawerOpen}
      // disableBackdropTransition={!iOS}
      // disableDiscovery={iOS}
    >
      <div className={classes.list} role="presentation">
        <List>
          <Link href="/" passHref>
            <ListItem button component="a">
              <ListItemIcon>
                <HomeIcon className={classes.icon} fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
          </Link>
          {me && (
            <>
              <Divider />
              <Link href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemIcon>
                    <PersonIcon className={classes.icon} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={"Profile"} />
                </ListItem>
              </Link>
            </>
          )}
          <Divider />
          <Link href="/about" passHref>
            <ListItem button component="a">
              <ListItemIcon>
                <InfoIcon className={classes.icon} fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={"About"} />
            </ListItem>
          </Link>
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default SwipeDrawer;
