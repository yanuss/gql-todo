import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

interface Props {
  open: boolean;
  handleClose: (arg: boolean) => void;
  deleteUser: () => void;
}

const DeleteUserDialog: React.FunctionComponent<Props> = ({
  open,
  handleClose,
  deleteUser
}) => {
  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle id="alert-dialog-title">
        {"Delete your account?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Permamently delete your account and all items associated
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose(false)}
          color="primary"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose(false);
            deleteUser();
          }}
          color="secondary"
          variant="contained"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteUserDialog;
