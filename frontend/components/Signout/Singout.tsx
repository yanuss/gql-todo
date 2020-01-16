import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import React from "react";
import { GET_TODOS } from "../Items/Items";
import { CURRENT_USER_QUERY } from "../User/User";
import CircularProgress from "@material-ui/core/CircularProgress";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -17,
      marginLeft: -17
    }
  })
);

const useSignout = () => {
  const [signout, { loading }] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ],
    awaitRefetchQueries: true
  });

  return { signout, loading };
};

const SignoutButton = () => {
  const classes = useStyles();
  const { signout, loading } = useSignout();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={(event: React.MouseEvent<HTMLElement>) => signout()}
    >
      Logout
      {loading && (
        <CircularProgress size={34} className={classes.buttonProgress} />
      )}
    </Button>
  );
};

export { useSignout };
export default SignoutButton;
