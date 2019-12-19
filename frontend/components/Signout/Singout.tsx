import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../User/User";
import Button from "@material-ui/core/Button";
import { GET_TODOS } from "../Items/Items";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const useSignout = () => {
  const [signout] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ]
  });

  return { signout };
};

const SignoutButton = () => {
  const { signout } = useSignout();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        signout();
      }}
    >
      Logout
    </Button>
  );
};

export { useSignout };
export default SignoutButton;
