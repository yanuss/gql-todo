import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [palette, setPalette] = useState("light");
  const [componentMounted, setComponentMounted] = useState(false);

  const setMode = mode => {
    window.localStorage.setItem("palete", mode);
    setPalette(mode);
  };

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

  return [palette, togglePalette, componentMounted];
};
