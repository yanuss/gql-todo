import React, { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme } from "@material-ui/core/styles";

export const useDarkMode = () => {
  const [palette, setPalette] = useState("light");
  const [componentMounted, setComponentMounted] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const selectedDarkmode = componentMounted && palette === "dark";

  const theme = React.useMemo(() => {
    return createMuiTheme({
      palette: {
        type: selectedDarkmode ? "dark" : "light"
      }
    });
  }, [prefersDarkMode, selectedDarkmode]);

  const togglePalette = () => {
    if (palette === "light") {
      setPalette("dark");
    } else {
      setPalette("light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("palete");
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    !localTheme
      ? setPalette("dark")
      : localTheme
      ? setPalette(localTheme)
      : setPalette("light");
    setComponentMounted(true);
  }, []);

  return { palette, togglePalette, componentMounted, theme };
};
