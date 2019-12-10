import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core/styles";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import Tooltip from "@material-ui/core/Tooltip";

const ToggleDarkModeButton = props => {
  const { palette } = useTheme();
  return (
    <Tooltip title="Toggle ligh/dark theme" aria-label="toggle theme">
      <IconButton aria-label="delete" onClick={props.togglePalette}>
        {palette.type === "light" ? (
          <Brightness4Icon />
        ) : (
          <BrightnessHighIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDarkModeButton;
