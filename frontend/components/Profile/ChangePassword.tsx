import React, { useState } from "react";
import useForm from "react-hook-form";
import * as yup from "yup";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";

const CHANGE_PASSWORD_MUTATION = gql`
  mutation CHANGE_PASSWORD_MUTATION(
    $password: String!
    $confirmPassword: String!
  ) {
    changeUserPassword(password: $password, confirmPassword: $confirmPassword) {
      message
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
        width: "100%"
      }
    },
    btnRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        width: "100%"
      },
      "& > :first-child": {
        marginRight: theme.spacing(1)
      }
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
  password: yup
    .string()
    .min(4)
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .min(4)
    .required("This field is required")
});

interface Props {
  showPasswordChange: (val: boolean) => void;
}

type ShowPassword2 = {
  [key: string]: boolean;
};

// interface ShowPassword {
//   password: keyof typeof ShowPassword2;
//   confirmPassword: boolean;
// }

interface FormValues {
  password?: string;
  confirmPassword?: string;
}

const ChangePassword: React.FC<Props> = props => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState<ShowPassword2>({
    password: false,
    confirmPassword: false
  });
  const { register, handleSubmit, reset, errors, watch } = useForm({
    validationSchema: schema
  });
  const [changePassword, { data, loading, error }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
    {
      // refetchQueries: [
      //   {
      //     query: CURRENT_USER_QUERY
      //   }
      // ],
      onCompleted: () => {
        setSuccess(true);
        reset();
      }
    }
  );

  const handleClickShowPassword = (field: string) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (
    data: FormValues
    // e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // e.preventDefault();
    changePassword({
      variables: {
        password: data.password,
        confirmPassword: data.confirmPassword
      }
    });
  };

  const saveButtonnClassName = clsx({
    [classes.buttonSuccess]: success
  });

  const watchAll = watch();
  const buttonsDisabled =
    Object.keys(watchAll).length === 2 &&
    (watchAll.password.length === 0 || watchAll.confirmPassword.length === 0);
  return (
    <>
      <Typography variant="h6">Change password</Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
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
        {error && (
          <Typography color="error" variant="inherit">
            {error.message.replace("GraphQL error: ", "")}
          </Typography>
        )}
        {data && (
          <Typography className={classes.success} variant="inherit">
            {data.changeUserPassword.message}
          </Typography>
        )}
        <div className={classes.btnRow}>
          <Button
            variant="contained"
            onClick={() => {
              props.showPasswordChange(false);
              reset();
            }}
          >
            {success ? "Close" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={saveButtonnClassName}
            type="submit"
            disabled={buttonsDisabled}
          >
            {`Change${success ? "d" : ""}`}
            {loading && (
              <CircularProgress size={34} className={classes.buttonProgress} />
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
