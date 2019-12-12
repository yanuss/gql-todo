import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import { CURRENT_USER_QUERY } from "../User/User";
import { GET_TODOS } from "../Items/Items";
import Link from "next/link";
import FacebookSignup from "../Signup/FacebookSignup";
import GoogleSiginin from "../Signup/GoogleSignin";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
        width: "100%"
      }
    },
    container: {
      margin: 0,
      "& > *": {
        width: "100%"
      }
    },
    margin: {
      "& > *": {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
      }
    },
    bigAvatar: {
      width: 100,
      height: 100
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -17,
      marginLeft: -17
    },
    dividerContainer: {
      margin: theme.spacing(2),
      position: "relative"
    },
    dividerText: {
      position: "absolute",
      top: "-12px",
      left: "50%",
      background: theme.palette.background.default,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: "center"
    },
    forgotBtn: {
      margin: 0
    }
  })
);

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}
const initialInputs = {
  email: "",
  password: "",
  showPassword: false
};

const Singin = () => {
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });

  const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION, {
    variables: {
      email: inputs.email,
      password: inputs.password
    },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ],
    onCompleted: () => {
      setInputs({ ...initialInputs });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setInputs({ ...inputs, showPassword: !inputs.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FacebookSignup label="Login with Facebook" />
      <GoogleSiginin label="Login with Google" />
      <div className={classes.dividerContainer}>
        <Divider />
        <Typography variant="inherit" className={classes.dividerText}>
          OR
        </Typography>
      </div>
      <form
        className={clsx(classes.container, classes.margin)}
        onSubmit={e => {
          e.preventDefault();
          signin();
        }}
      >
        <TextField
          onChange={handleChange}
          label="Email"
          name="email"
          value={inputs.email}
          autoComplete="current-email"
          margin="normal"
          variant="outlined"
          size="small"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel required htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            type={inputs.showPassword ? "text" : "password"}
            value={inputs.password}
            onChange={handleChange}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {inputs.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <Link href="/requestReset" passHref>
          <Button color="primary" component="a" className={classes.forgotBtn}>
            Forgot Password?
          </Button>
        </Link>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Log in
          {loading && (
            <CircularProgress size={34} className={classes.buttonProgress} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default Singin;
