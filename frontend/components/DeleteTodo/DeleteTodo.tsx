import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteForeverIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GET_TODOS } from "../Items/Items";
import clsx from "clsx";

const DELETE_TODO = gql`
  mutation UPDATE_TODO($id: ID!) {
    deleteItem(where: { id: $id }) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    buttonError: {
      backgroundColor: red[500],
      "&:hover": {
        backgroundColor: red[700]
      }
    }
  })
);

const DeleteTodo = ({ id }) => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [deleteTodo, { loading }] = useMutation(DELETE_TODO);
  const timer = React.useRef<number>();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error
  });

  const handleError = () => {
    setError(true);
    setSuccess(false);
    timer.current = setTimeout(() => {
      setError(false);
    }, 1500);
  };

  return (
    <IconButton
      aria-label="delete"
      className={buttonClassname}
      disabled={loading}
      onClick={() => {
        if (!loading) {
          setSuccess(false);
          deleteTodo({
            variables: { id },
            refetchQueries: [
              {
                query: GET_TODOS
              }
            ],
            onCompleted: [setSuccess(true)],
            onError: [handleError()]
          });
        }
      }}
    >
      <DeleteForeverIcon fontSize="small" />
      {loading && (
        <CircularProgress size={34} className={classes.buttonProgress} />
      )}
    </IconButton>
  );
};

export default DeleteTodo;
