import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useSignout } from "../Signout/Singout";
import Avatar from "@material-ui/core/Avatar";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";
import Fade from "@material-ui/core/Fade";
import {
  createStyles,
  Theme,
  makeStyles,
  useTheme
} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountInfoContainer: {
      display: "flex",
      flexDirection: "column"
    },
    accountInfo: {
      fontSize: theme.typography.fontSize - 2,
      marginLeft: theme.spacing(1.5)
    }
  })
);

const AvatarMenu = props => {
  const classes = useStyles();
  const { palette } = useTheme();
  const { signout } = useSignout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const { togglePalette } = useDarkMode();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        alt={props.data.me.name || ""}
        src={props.data.me.image || ""}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="customized-menu"
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
        <MenuItem>
          <Avatar
            alt={props.data.me.name || ""}
            src={props.data.me.image || ""}
            aria-controls="simple-menu"
            aria-haspopup="true"
          />
          <div className={classes.accountInfoContainer}>
            <Typography variant="inherit" className={classes.accountInfo}>
              {props.data.me.name}
            </Typography>
            <Typography variant="inherit" className={classes.accountInfo}>
              {props.data.me.email}
            </Typography>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={props.togglePalette}>
          <ListItemIcon>
            {palette.type === "light" ? (
              <Brightness4Icon fontSize="small" />
            ) : (
              <Brightness4OutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <Typography variant="inherit">
            {palette.type === "light" ? "Light" : "Dark"} theme
          </Typography>
        </MenuItem>
        <MenuItem onClick={signout}>
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
