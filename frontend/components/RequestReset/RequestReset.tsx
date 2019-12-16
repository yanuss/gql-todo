import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { red } from "@material-ui/core/colors";
import clsx from "clsx";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
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
  })
);

interface State {
  email: string;
}
const initialInputs = {
  email: ""
};

const RequestReset = () => {
  const classes = useStyles();
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });

  const [reset, { data, loading, error, called }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: {
        email: inputs.email
      },
      onCompleted: () => {
        setInputs({ ...initialInputs });
      }
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form
      className={classes.container}
      onSubmit={e => {
        e.preventDefault();
        reset();
      }}
    >
      <Typography variant="h5">Reset your password</Typography>
      <Typography variant="inherit">
        Please enter your email address. We will send you an email to reset your
        password.
      </Typography>

      <TextField
        onChange={handleChange}
        label="Email"
        name="email"
        className={classes.textField}
        value={inputs.email}
        autoComplete="current-email"
        margin="normal"
        variant="outlined"
        size="small"
        required
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        Request Reset Password
        {loading && (
          <CircularProgress size={34} className={classes.buttonProgress} />
        )}
      </Button>
    </form>
  );
};

export default RequestReset;
