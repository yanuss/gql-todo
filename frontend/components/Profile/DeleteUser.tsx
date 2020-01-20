import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import gql from "graphql-tag";
import React, { useState } from "react";
import { GET_TODOS } from "../Items/Items";
import { CURRENT_USER_QUERY } from "../User/User";
import DeleteUserDialog from "./DeleteUserDialog";
import { deleteToken } from "../../lib/auth";

const DELETE_USER = gql`
  mutation DELETE_USER {
    deleteUser {
      message
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(2)
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

const DeleteUser = ({ userId }: { userId: string }) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY
      },
      {
        query: GET_TODOS
      }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      deleteToken();
    }
  });
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        disabled={loading}
        className={classes.button}
        onClick={(event: React.MouseEvent<HTMLElement>) => setOpenDialog(true)}
      >
        Delete account
        {loading && (
          <CircularProgress size={34} className={classes.buttonProgress} />
        )}
      </Button>
      <DeleteUserDialog
        open={openDialog}
        handleClose={setOpenDialog}
        deleteUser={deleteUser}
      />
    </>
  );
};

export default DeleteUser;
