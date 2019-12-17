import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
import useForm from "react-hook-form";
import * as yup from "yup";

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
  // email: string;
  // password: string;
  showPassword: boolean;
}
const initialInputs = {
  // email: "",
  // password: "",
  showPassword: false
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please provide correct email"),
  password: yup.string().required("This field is required")
});

const Singin = () => {
  const classes = useStyles();
  const { register, handleSubmit, reset, errors } = useForm({
    validationSchema: schema
  });
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });

  const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION, {
    // variables: {
    //   email: inputs.email,
    //   password: inputs.password
    // },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ],
    onCompleted: () => {
      // setInputs({ ...initialInputs });
      reset();
    }
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputs({
  //     ...inputs,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const handleClickShowPassword = () => {
    setInputs({ ...inputs, showPassword: !inputs.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: object, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    signin({
      variables: {
        email: data.email,
        password: data.password
      }
    });
  };

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
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          // onChange={handleChange}
          // value={inputs.email}
          autoComplete="current-email"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.email}
          helperText={errors.email && errors.email.message}
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Password"
          name="password"
          type={inputs.showPassword ? "text" : "password"}
          // onChange={handleChange}
          // value={inputs.password}
          autoComplete="current-name"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.password}
          helperText={errors.password && errors.password.message}
          // required
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  name="showPassword"
                >
                  {inputs.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {error && (
          <Typography color="error" variant="inherit">
            {error.message.replace("GraphQL error: ", "")}
          </Typography>
        )}
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
