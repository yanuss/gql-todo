import React from "react";
import Reset from "../components/Reset/Reset";

const ResetPage = props => {
  return <Reset resetToken={props.query.resetToken} />;
};
export default ResetPage;
