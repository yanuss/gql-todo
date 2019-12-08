import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../User/User";
import Button from "@material-ui/core/Button";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => {
  const [
    signout
    // { data, loading, error }
  ] = useMutation(SIGNOUT_MUTATION, {
    // variables: { ...inputs },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      }
    ]
    // onCompleted: () => {
    //   setInputs({ ...initialInputs });
    //   handleClose();
    // }
  });

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        signout();
      }}
      // disabled={!inputs.title}
    >
      Signout
    </Button>
  );
};

export default Signout;
