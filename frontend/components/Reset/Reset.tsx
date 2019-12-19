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
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import useForm from "react-hook-form";
import * as yup from "yup";
import { CURRENT_USER_QUERY } from "../User/User";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import { red } from "@material-ui/core/colors";

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
      flexDirection: "column",
      textAlign: "center",
      width: "300px",
      "& > *": {
        marginBottom: theme.spacing(2)
      },
      "& > :last-child": {
        marginTop: theme.spacing(3)
      }
      // flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "auto"
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

    // '& MuiFormControl-root'
  })
);

const schema = yup.object().shape({
  password: yup.string().required(),
  confirmPassword: yup.string().required()
});

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
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema
  });
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
  console.log(error && error);

  const onSubmit = (data, e) => {
    e.preventDefault();
    signin();
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5">Change your password</Typography>
      <Typography variant="inherit">
        Please enter your new password twice.
      </Typography>
      <TextField
        onChange={handleChange}
        label="Password"
        name="password"
        type={inputs.showPassword ? "text" : "password"}
        value={inputs.password}
        autoComplete="current-name"
        margin="normal"
        variant="outlined"
        size="small"
        error={!!errors.password}
        helperText={errors.password && errors.password.message}
        // required
        inputRef={register}
        InputProps={{
          endAdornment: (
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
          )
        }}
      />
      <TextField
        onChange={handleChange}
        label="Confirm Password"
        name="confirmPassword"
        type={inputs.showConfirmPassword ? "text" : "password"}
        value={inputs.confirmPassword}
        margin="normal"
        variant="outlined"
        size="small"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
        // required
        inputRef={register}
        InputProps={{
          endAdornment: (
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
          )
        }}
      />
      {/* {error && (
        <Typography color="error" variant="inherit">
          {error}
        </Typography>
      )} */}
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
