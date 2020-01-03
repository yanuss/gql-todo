import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import HomeIcon from "@material-ui/icons/Home";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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
  const classes = useStyles();

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
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default SwipeDrawer;
