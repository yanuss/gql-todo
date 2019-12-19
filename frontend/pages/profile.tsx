import React from "react";
import Profile from "../components/Profile/Profile";
import User from "../components/User/User";
import ProfileLoading from "../components/Profile/ProfileLoading";

const ProfilePage = () => {
  return (
    <User>
      {(data, loading) => {
        if (loading) {
          return <ProfileLoading />;
        }
        if (data && data.me) {
          return <Profile user={data.me} />;
        } else {
          return <p>not logged in</p>;
        }
      }}
    </User>
  );
};
export default ProfilePage;
