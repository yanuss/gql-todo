import { useEffect, useState } from "react";

const useWindowDimensions = () => {
  const [windowDimensions, setWindow] = useState<{
    width: undefined | number;
  }>({
    width: undefined
  });
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.innerWidth !== windowDimensions.width
    ) {
      setWindow({
        width: window.innerWidth
      });
    }
  });

  return windowDimensions;
};

export default useWindowDimensions;
