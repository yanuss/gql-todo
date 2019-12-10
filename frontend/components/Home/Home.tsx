import React from "react";
import AuthTabs from "../AuthTabs/AuthTabs";
import User, { useUser } from "../User/User";
import Items from "../Items/Items";

const Home = props => {
  const { data, loading, error } = useUser();
  return (
    <>
      {data && data.me && <Items />}
      {data && !data.me && <AuthTabs />}
    </>
  );
};

export default Home;
