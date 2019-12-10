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
import FacebookSignup from "./FacebookSignup";
import GoogleSiginin from "./GoogleSignin";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const SIGNNUP_MUTATION = gql`
  mutation SIGNNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
    $image: String
  ) {
    signup(name: $name, email: $email, password: $password, image: $image) {
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
      alignItems: "cennter"
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
    },
    dividerContainer: {
      margin: theme.spacing(2),
      position: "relative"
    },
    dividerText: {
      position: "absolute",
      top: "-10px",
      left: "50%",
      background: theme.palette.background.default,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  })
);

interface State {
  name: string;
  email: string;
  password: string;
  image: string;
  showPassword: boolean;
}
const initialInputs = {
  name: "",
  email: "",
  password: "",
  image: "",
  showPassword: false
};

const Singup = () => {
  const classes = useStyles();
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });
  const [signup, { data, loading, error }] = useMutation(SIGNNUP_MUTATION, {
    variables: {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
      image: inputs.image
    },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
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

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "gql-todo");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/yanus/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    setInputs({
      ...inputs,
      image: file.secure_url
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

  return (
    <div className={classes.container}>
      <FacebookSignup label="Sign up with Facebook" />
      <GoogleSiginin label="Sign up with Google" />
      <div className={classes.dividerContainer}>
        <Divider />
        <Typography variant="inherit" className={classes.dividerText}>
          OR
        </Typography>
      </div>
      <form
        className={classes.container}
        onSubmit={e => {
          e.preventDefault();
          signup();
        }}
      >
        <TextField
          onChange={handleChange}
          label="Name"
          name="name"
          className={classes.textField}
          value={inputs.name}
          autoComplete="current-name"
          margin="normal"
          variant="outlined"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlinedIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          onChange={handleChange}
          label="Email"
          name="email"
          className={classes.textField}
          value={inputs.email}
          autoComplete="current-email"
          margin="normal"
          variant="outlined"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
        >
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
        <TextField
          onChange={uploadFile}
          label="Avatar Img"
          className={classes.textField}
          type="file"
          autoComplete="current-password"
          margin="normal"
          variant="outlined"
        />
        {inputs.image && (
          <Avatar
            alt={inputs.name}
            src={inputs.image}
            className={classes.bigAvatar}
          />
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
