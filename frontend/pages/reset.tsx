import React from "react";
import Reset from "../components/Reset/Reset";
import RequestReset from "../components/RequestReset/RequestReset";
interface Props {
  query: {
    resetToken: string;
  };
}

const ResetPage: React.FC<Props> = props => {
  return (
    <>
      {!props.query.resetToken ? (
        <RequestReset />
      ) : (
        <Reset resetToken={props.query.resetToken} />
      )}
    </>
  );
};
export default ResetPage;
