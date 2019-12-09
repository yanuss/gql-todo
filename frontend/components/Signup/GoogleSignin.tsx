import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import GoogleLogin from "react-google-login";
import { fbAppId } from "../../config";
import { CURRENT_USER_QUERY } from "../User/User";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { googleAppId } from "../../config";

const GOOGLE_SIGNIN_MUTATION = gql`
  mutation GOOGLE_SIGNIN_MUTATION(
    $name: String!
    $email: String!
    $googleUserId: String!
    $image: String
  ) {
    googleSignin(
      name: $name
      email: $email
      googleUserId: $googleUserId
      image: $image
    ) {
      id
      email
      name
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

const GoogleSignin = () => {
  const classes = useStyles();
  const [googleSignin, { data, loading, error }] = useMutation(
    GOOGLE_SIGNIN_MUTATION,
    {
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY
        }
      ]
    }
  );
  const responseGoogle = response => {
    if (response) {
      googleSignin({
        variables: {
          email: response.profileObj.email,
          name: response.profileObj.name,
          googleUserId: response.profileObj.googleId,
          image: response.profileObj.imageUrl
        }
      });
    }
  };
  return (
    <GoogleLogin
      clientId={googleAppId}
      onSuccess={responseGoogle}
      // onFailure={responseGoogle}
      // cookiePolicy={"single_host_origin"}
      // render={renderProps => (
      //   <Button
      //     variant="contained"
      //     color="primary"
      //     type="submit"
      //     // disabled={loading}
      //     onClick={renderProps.onClick}
      //     // startIcon={<FacebookIcon />}
      //   >
      //     Login with Google
      //     {/* {loading && (
      //       <CircularProgress size={34} className={classes.buttonProgress} />
      //     )} */}
      //   </Button>
      // )}
    />
  );
};

export default GoogleSignin;
