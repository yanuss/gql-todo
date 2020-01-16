// @ts-nocheck
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Fade from "@material-ui/core/Fade";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Router from "next/router";
import React from "react";
import { useSignout } from "../Signout/Singout";
import { useUser } from "../User/User";
// import { ButtonBaseProps } from "@material-ui/core/ButtonBase";
// import Icon from "@material-ui/core/Icon";
// import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountInfoContainer: {
      display: "flex",
      flexDirection: "column"
    },
    accountInfo: {
      fontSize: theme.typography.fontSize - 2,
      marginLeft: theme.spacing(1.5)
    },
    avatar: {},
    wrapper: {
      margin: theme.spacing(1),
      position: "relative"
    },
    loader: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -23,
      marginLeft: -23
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -17,
      marginLeft: -17
    }
  })
);

const AvatarMenu = (props: any) => {
  const { data, loading } = useUser();
  const classes = useStyles(props);
  const { signout, loading: loadingSignout } = useSignout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (me) {
      setAnchorEl(event.currentTarget);
    } else {
      Router.push("/");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const me = data && data.me;
  return (
    <>
      <div className={classes.wrapper}>
        <Tooltip
          title={me ? "Open menu" : "You are not logged in"}
          aria-label="menu"
        >
          <ButtonBase
            component={Avatar}
            alt={(me && me.name) || ""}
            src={(me && me.image) || ""}
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="medium"
          >
            {!me && <AccountCircleIcon />}
          </ButtonBase>
        </Tooltip>
        {loading && (
          <CircularProgress
            size={46}
            thickness={5}
            className={classes.loader}
          />
        )}
      </div>
      {me && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          TransitionComponent={Fade}
        >
          <MenuItem
            onClick={() => {
              Router.push("/profile");
            }}
          >
            <Avatar
              alt={me.name || ""}
              src={me.image || ""}
              aria-controls="simple-menu"
              aria-haspopup="true"
            />
            <div className={classes.accountInfoContainer}>
              <Typography variant="inherit" className={classes.accountInfo}>
                {me.name}
              </Typography>
              <Typography variant="inherit" className={classes.accountInfo}>
                {me.email}
              </Typography>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={signout}>
            <ListItemIcon>
              <PowerSettingsNewIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Logout</Typography>
            {loadingSignout && (
              <CircularProgress size={34} className={classes.buttonProgress} />
            )}
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default AvatarMenu;
