import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useSignout } from "../Signout/Singout";
import Avatar from "@material-ui/core/Avatar";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness4OutlinedIcon from "@material-ui/icons/Brightness4Outlined";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
// import { useDarkMode } from "../../lib/useDarkMode";
import Fade from "@material-ui/core/Fade";
import { useTheme } from "@material-ui/core/styles";

const AvatarMenu = props => {
  const { palette } = useTheme();
  // const { togglePalette } = useDarkMode();
  const { signout } = useSignout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={props.togglePalette}>
          <ListItemIcon>
            {palette.type === "light" ? (
              <Brightness4Icon fontSize="small" />
            ) : (
              <Brightness4OutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <Typography variant="inherit">
            Theme {palette.type === "light" ? "light" : "dark"}
          </Typography>
        </MenuItem>
        <MenuItem onClick={signout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
