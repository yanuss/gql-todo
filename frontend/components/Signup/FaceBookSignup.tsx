import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { fbAppId } from "../../config";
import { CURRENT_USER_QUERY } from "../User/User";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { green } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import { GET_TODOS } from "../Items/Items";

const FACEBOOK_SIGNUP_MUTATION = gql`
  mutation FACEBOOK_SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $facebookUserId: String!
    $image: String
  ) {
    facebookSignin(
      name: $name
      email: $email
      facebookUserId: $facebookUserId
      image: $image
    ) {
      id
      email
      name
    }
  }
`;

const FACEBOOK_SIGNIN_WITH_TOKEN_MUTATION = gql`
  mutation FACEBOOK_SIGNIN_WITH_TOKEN_MUTATION($idToken: String!) {
    facebookSigninWithToken(idToken: $idToken) {
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

const FacebookSignup = props => {
  const classes = useStyles();
  // const [facebookSignin, { data, loading, error }] = useMutation(
  //   FACEBOOK_SIGNUP_MUTATION,
  //   {
  //     refetchQueries: [
  //       {
  //         query: CURRENT_USER_QUERY
  //       }
  //     ]
  //   }
  // );
  const [facebookSigninWithToken, { data, loading, error }] = useMutation(
    FACEBOOK_SIGNIN_WITH_TOKEN_MUTATION,
    {
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY
        },
        {
          query: GET_TODOS
        }
      ]
    }
  );
  const responseFacebook = response => {
    // console.log(response);
    if (response) {
      try {
        // facebookSignin({
        //   variables: {
        //     email: response.email,
        //     name: response.name,
        //     facebookUserId: response.userID,
        //     image: response.picture.data.url
        //   }
        // });
        facebookSigninWithToken({
          variables: {
            idToken: response.accessToken
          }
        });
      } catch (error) {
        // console.log(error);
      }
    }
  };
  return (
    <>
      <FacebookLogin
        appId={fbAppId}
        fields="name,email,picture"
        callback={responseFacebook}
        icon="fa-facebook"
        render={renderProps => (
          <Button
            variant="contained"
            // variant="outlined"
            color="primary"
            type="submit"
            disabled={loading}
            onClick={renderProps.onClick}
            startIcon={<FacebookIcon />}
          >
            {props.label ? props.label : "Login with Facebook"}
            {loading && (
              <CircularProgress size={34} className={classes.buttonProgress} />
            )}
          </Button>
        )}
      />
    </>
  );
};

export default FacebookSignup;
