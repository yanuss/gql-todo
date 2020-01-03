import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

const ProfileLoading = () => {
  return (
    <div style={{ width: "100%" }}>
      <Skeleton variant="circle" width={128} height={128} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <div style={{ display: "flex" }}>
        <Skeleton
          variant="text"
          width={200}
          height={40}
          style={{ marginRight: "16px" }}
        />
        <Skeleton variant="text" width={200} height={40} />
      </div>
    </div>
  );
};

export default ProfileLoading;
