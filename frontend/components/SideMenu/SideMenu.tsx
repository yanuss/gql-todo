import React from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { drawerWidth } from "../Page/Page";
import Link from "next/link";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    hide: {
      display: "none"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end"
    }
  })
);

const SideMenu = props => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        {/* {["MyList"].map((text, index) => ( */}
        <Link href="/mylist" passHref>
          <ListItem button component="a">
            {/* <ListItemIcon> */}
            {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
            {/* </ListItemIcon> */}
            <ListItemText primary={"TODO"} />
          </ListItem>
        </Link>
        <Link href="/signin" passHref>
          <ListItem button component="a">
            {/* <ListItemIcon> */}
            {/* {index % 2 === 0 ? <InboxsIcon /> : <MailIcon />} */}
            {/* </ListItemIcon> */}
            <ListItemText primary={"signin"} />
          </ListItem>
        </Link>
        <Link href="/signup" passHref>
          <ListItem button component="a">
            {/* <ListItemIcon> */}
            {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
            {/* </ListItemIcon> */}
            <ListItemText primary={"signup"} />
          </ListItem>
        </Link>
        {/* ))} */}
      </List>
      <Divider />
      <List>
        <Switch
          checked={props.palette === "dark"}
          onChange={props.togglePalette}
        />
      </List>
    </Drawer>
  );
};

export default SideMenu;
