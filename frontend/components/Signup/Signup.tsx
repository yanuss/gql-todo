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
import { CURRENT_USER_QUERY } from "../User/User";
import FacebookSignup from "./FacebookSignup";
import GoogleSiginin from "./GoogleSignin";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import useForm from "react-hook-form";
import * as yup from "yup";

const SIGNNUP_MUTATION = gql`
  mutation SIGNNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
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
    }
  })
);

const schema = yup.object().shape({
  name: yup.string().required("This field is required"),
  email: yup
    .string()
    .required("This field is required")
    .email("Incorrect Email"),
  password: yup.string().required("This field is required")
});

const Singup = () => {
  const classes = useStyles();
  const { register, handleSubmit, reset, errors } = useForm({
    validationSchema: schema
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { loading, error }] = useMutation(SIGNNUP_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      }
    ],
    onCompleted: () => {
      reset();
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: object, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    signup({
      variables: {
        name: data.name,
        email: data.email,
        password: data.password
      }
    });
  };

  return (
    <div className={classes.root}>
      <FacebookSignup label="Sign up with Facebook" />
      <GoogleSiginin label="Sign up with Google" />
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
          label="Name"
          name="name"
          autoComplete="current-name"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.name}
          helperText={errors.name && errors.name.message}
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlinedIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="current-email"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.email || (error && error.email)}
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
          type={showPassword ? "text" : "password"}
          autoComplete="current-name"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.password}
          helperText={errors.password && errors.password.message}
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
                  {showPassword ? <Visibility /> : <VisibilityOff />}
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
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Signup
          {loading && (
            <CircularProgress size={34} className={classes.buttonProgress} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default Singup;
