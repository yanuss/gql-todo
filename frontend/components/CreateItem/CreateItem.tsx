import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { GET_TODOS } from "../Items/Items";
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { display } from "@material-ui/system";

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
  selectedDate: "",
  image: "",
  date: null,
  done: false
};

const CreateItem = ({ itemData }) => {
  const [createItem, { data, loading, error }] = useMutation(ADD_TODO);
  const classes = useStyles();
  const [showForm, setShowForm] = useState(true);
  const [inputs, setInputs] = useState({
    ...initialInputs
  });

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

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
    <div className={classes.root}>
      {showForm && (
        <form
          className={classes.form}
          noValidate
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            createItem({
              variables: { ...inputs },
              refetchQueries: [
                {
                  query: GET_TODOS
                }
              ],
              onCompleted: setInputs({ ...initialInputs })
            });
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
              name="selectedDate"
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </form>
      )}
      {/* <Divider /> */}
      <Fab color="primary" aria-label="add" onClick={handleShowForm}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default CreateItem;
