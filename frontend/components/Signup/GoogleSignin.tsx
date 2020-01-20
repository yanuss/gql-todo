import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import GoogleLogin from "react-google-login";
import { CURRENT_USER_QUERY } from "../User/User";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { googleAppId } from "../../config";
import { GET_TODOS } from "../Items/Items";
import { green } from "@material-ui/core/colors";
import { setToken } from "../../lib/auth";

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
      token
      user {
        id
        email
        name
      }
    }
  }
`;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: "6px",
      justifyContent: "center",
      position: "relative",
      "& > *": {
        padding: 0
      }
    },
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

interface Props {
  label?: string;
}

const GoogleSignin: React.FC<Props> = props => {
  const classes = useStyles();

  const [googleSignin, { loading }] = useMutation(GOOGLE_SIGNIN_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ],
    awaitRefetchQueries: true,
    onCompleted: data => {
      const token = data.googleSignin.token;
      setToken(token);
    }
  });
  const responseGoogle = <T extends { [key: string]: any }>(response: T) => {
    if (response) {
      try {
        googleSignin({
          variables: {
            email: response.profileObj.email,
            name: response.profileObj.name,
            googleUserId: response.profileObj.googleId,
            image: response.profileObj.imageUrl
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <GoogleLogin
      clientId={googleAppId}
      onSuccess={responseGoogle}
      buttonText={props.label}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      className={classes.button}
      disabled={loading}
      // style={{}}
      // theme={"dark"}
      //   render={renderProps => (
      //     <Button
      //       variant="contained"
      //       color="primary"
      //       type="submit"
      //       // disabled={loading}
      //       onClick={renderProps.onClick}
      //       startIcon={<GoogleIcon />}
      //     >
      //       Login with Google
      //       {loading && (
      //         <CircularProgress size={34} className={classes.buttonProgress} />
      //       )}
      //     </Button>
      //   )}
      // />
    >
      {loading && (
        <CircularProgress size={34} className={classes.buttonProgress} />
      )}
    </GoogleLogin>
  );
};

export default GoogleSignin;
