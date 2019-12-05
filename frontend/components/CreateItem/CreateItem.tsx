import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import { GET_TODOS } from "../Items/Items";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { display } from "@material-ui/system";
import { UPDATE_TODO } from "../Item/Item";

const ADD_TODO = gql`
  mutation ADD_TODO(
    $title: String!
    $image: String
    $done: Boolean
    $description: String
  ) {
    createItem(
      title: $title
      image: $image
      done: $done
      description: $description
    ) {
      id
      title
      image
      done
      description
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    form: {
      margin: theme.spacing(1),
      width: 400,
      "& > *": {
        display: "block"
      }
    }
    // extendedIcon: {
    //   marginRight: theme.spacing(1)
    // }
  })
);

const initialInputs = {
  title: "",
  description: "",
  image: "",
  date: null,
  done: false
};

const CreateItem = ({ open, itemData, handleClose }) => {
  const [
    updateTodo
    // { data, loading, error }
  ] = useMutation(UPDATE_TODO);
  const [
    createItem
    //  { data, loading, error }
  ] = useMutation(ADD_TODO);

  const classes = useStyles();
  // const [showForm, setShowForm] = useState(true);
  const [inputs, setInputs] = useState({
    ...initialInputs
  });

  useEffect(() => {
    if (itemData.id) {
      setInputs({ ...itemData, done: false });
    }
  }, [itemData]);

  useEffect(() => {
    if (!open) {
      setInputs({ ...initialInputs });
    }
  }, [open]);

  // const handleShowForm = () => {
  //   setShowForm(!showForm);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setInputs({ ...inputs, date });
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          if (itemData.id) {
            updateTodo({
              variables: { ...inputs },
              refetchQueries: [
                {
                  query: GET_TODOS
                }
              ],
              onCompleted: [setInputs({ ...initialInputs }), handleClose()]
            });
          } else {
            createItem({
              variables: { ...inputs },
              refetchQueries: [
                {
                  query: GET_TODOS
                }
              ],
              onCompleted: [setInputs({ ...initialInputs }), handleClose()]
            });
          }
        }}
      >
        <TextField
          id="standard-basic"
          label="Title"
          name="title"
          value={inputs.title}
          onChange={handleChange}
        />
        <TextField
          id="standard-basic"
          label="Description"
          name="description"
          value={inputs.description}
          onChange={handleChange}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date"
            value={inputs.date}
            onChange={handleDateChange}
            name="date"
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={!inputs.title}
        >
          Save
        </Button>
      </form>
    </Dialog>
  );
};

export default CreateItem;
