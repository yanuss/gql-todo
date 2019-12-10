import React, { useState, useEffect } from "react";
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
import Tooltip from "@material-ui/core/Tooltip";

const DELETE_TODO = gql`
  mutation DELETE_TODO($id: ID!) {
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
    }, 2000);
  };

  const [deleteTodo, { data, loading }] = useMutation(DELETE_TODO, {
    variables: { id },
    update: (cache, { data: { deleteItem } }) => {
      const data = cache.readQuery({ query: GET_TODOS });
      const updatedItems = [...data.items].filter(
        item => item.id !== deleteItem.id
      );
      cache.writeQuery({ query: GET_TODOS, data: { items: updatedItems } });
    },
    // refetchQueries: [{ query: GET_TODOS }],
    onCompleted: () => {
      setSuccess(true);
      //start updating cache at this point?
    },
    onError: handleError
  });

  return (
    <Tooltip title="Delete item" aria-label="menu">
      <IconButton
        aria-label="delete"
        className={buttonClassname}
        disabled={loading}
        onClick={() => {
          setSuccess(false);
          deleteTodo();
        }}
      >
        <DeleteForeverIcon fontSize="small" />
        {loading && (
          <CircularProgress size={34} className={classes.buttonProgress} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default DeleteTodo;
