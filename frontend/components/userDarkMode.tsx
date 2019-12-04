import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [palette, sePalette] = useState("light");
  const [componentMounted, setComponentMounted] = useState(false);

  const setMode = mode => {
    window.localStorage.setItem("palete", mode);
    sePalette(mode);
  };

  const togglePalette = () => {
    if (palette === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("palete");

    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    !localTheme
      ? setMode("dark")
      : localTheme
      ? sePalette(localTheme)
      : setMode("light");

    setComponentMounted(true);
  }, []);

  return [palette, togglePalette, componentMounted];
};
