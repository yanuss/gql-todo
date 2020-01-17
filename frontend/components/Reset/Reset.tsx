import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import clsx from "clsx";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
    },
    buttonSuccess: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[700]
      }
    },
    success: {
      color: green[500]
    }
  })
);

const schema = yup.object().shape({
  password: yup.string().required(),
  confirmPassword: yup.string().required()
});

interface Props {
  resetToken: string;
}

interface FormValues {
  password?: string;
  confirmPassword?: string;
}
type ShowPassword = {
  [key: string]: boolean;
};

type Form = {
  password: string;
  confirmPassword: string;
};

const Reset: React.FC<Props> = props => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, errors, reset } = useForm<Form>({
    validationSchema: schema
  });
  const [showPassword, setShowPassword] = useState<ShowPassword>({
    password: false,
    confirmPassword: false
  });

  const [signin, { data, loading, error }] = useMutation(RESET_MUTATION, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      }
    ],
    onCompleted: () => {
      setSuccess(true);
      reset();
    }
  });

  const handleClickShowPassword = (field: string) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: FormValues) => {
    signin({
      variables: {
        resetToken: props.resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword
      }
    });
  };

  const saveButtonnClassName = clsx({
    [classes.buttonSuccess]: success
  });

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5">Change your password</Typography>
      <Typography variant="inherit">
        Please enter your new password twice.
      </Typography>
      <TextField
        label="New password"
        name="password"
        type={showPassword.password ? "text" : "password"}
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
                onClick={() => handleClickShowPassword("password")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                name="showPassword"
              >
                {showPassword.password ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        label="Confirm new password"
        name="confirmPassword"
        type={showPassword.confirmPassword ? "text" : "password"}
        autoComplete="current-name"
        margin="normal"
        variant="outlined"
        size="small"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
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
                onClick={() => handleClickShowPassword("confirmPassword")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword.confirmPassword ? (
                  <Visibility />
                ) : (
                  <VisibilityOff />
                )}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button
        variant="contained"
        color="primary"
        className={saveButtonnClassName}
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

export default Reset;
