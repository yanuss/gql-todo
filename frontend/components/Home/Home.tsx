import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import AuthTabs from "../AuthTabs/AuthTabs";
import Items from "../Items/Items";
import { useUser } from "../User/User";

const Home = () => {
  const { data, loading, error } = useUser();
  const [serverAwake, setServerAwake] = useState<boolean>(true);
  const timer = React.useRef<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("serverAwake")) {
        setServerAwake(true);
      }
      if (loading) {
        timer.current = setTimeout(() => {
          setServerAwake(false);
          window.localStorage.removeItem("serverAwake");
        }, 6000);
      } else if (!serverAwake) {
        window.localStorage.setItem("serverAwake", "true");
        setServerAwake(true);
      }
    }
  }, [data, loading, serverAwake]);

  return (
    <>
      {loading && !serverAwake && !error && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress size={46} thickness={5} />
          <p>hold on, waking up the server...</p>
        </div>
      )}
      {error && <p>server down, try again later</p>}
      {data && data.me && <Items />}
      {data && !data.me && <AuthTabs />}
    </>
  );
};

export default Home;
