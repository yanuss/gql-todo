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
import { red } from "@material-ui/core/colors";
import clsx from "clsx";
import { CURRENT_USER_QUERY } from "../User/User";
import Link from "next/link";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
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
      flexDirection: "column"
      // flexWrap: "wrap"
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
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}
const initialInputs = {
  password: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false
};

const Singin = props => {
  const classes = useStyles();
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });

  const [signin, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: {
      resetToken: props.resetToken,
      password: inputs.password,
      confirmPassword: inputs.confirmPassword
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

  const handleClickShowPassword = field => {
    setInputs({ ...inputs, [field]: !inputs[field] });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form
      className={classes.container}
      onSubmit={e => {
        e.preventDefault();
        signin();
      }}
    >
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
                onClick={() => handleClickShowPassword("showPassword")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                name="showPassword"
              >
                {inputs.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
      </FormControl>
      <FormControl
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
      >
        <InputLabel required htmlFor="outlined-adornment-password">
          Connfirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={inputs.showConfirmPassword ? "text" : "password"}
          value={inputs.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showConfirmPassword")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                name="showConfirmPassword"
              >
                {inputs.showConfirmPassword ? (
                  <Visibility />
                ) : (
                  <VisibilityOff />
                )}
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
        Change Password
        {loading && (
          <CircularProgress size={34} className={classes.buttonProgress} />
        )}
      </Button>
    </form>
  );
};

export default Singin;
