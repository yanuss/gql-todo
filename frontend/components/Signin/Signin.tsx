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
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import clsx from "clsx";
import { CURRENT_USER_QUERY } from "../User/User";
import { GET_TODOS } from "../Items/Items";
import Link from "next/link";
import Router from "next/router";

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
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 250
    },
    margin: {
      margin: theme.spacing(1)
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
      Router.push({
        pathname: "/mylist"
      });
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
    <form
      className={classes.container}
      onSubmit={e => {
        e.preventDefault();
        signin();
      }}
    >
      <TextField
        // id="filled-password-input"
        onChange={handleChange}
        label="Email"
        name="email"
        className={classes.textField}
        value={inputs.email}
        // type="eMail"
        autoComplete="current-email"
        margin="normal"
        variant="outlined"
        required
      />
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
      >
        <InputLabel required htmlFor="outlined-adornment-password">
          Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
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
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        Signin
        {loading && (
          <CircularProgress size={34} className={classes.buttonProgress} />
        )}
      </Button>
      <Link href="/requestReset" passHref>
        <Button variant="contained" color="primary" component="a">
          Forgot Password?
        </Button>
      </Link>
    </form>
  );
};

export default Singin;
