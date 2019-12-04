import React, { useState } from "react";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {
  // MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";

// const CREATE_ITEM_MUTATION = gql``;

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
      width: 200
    }
    // extendedIcon: {
    //   marginRight: theme.spacing(1)
    // }
  })
);

const CreateItem = ({ data }) => {
  const classes = useStyles();
  const [showForm, setShowForm] = useState(true);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    selectedDate: "",
    image: ""
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
    console.log(date);
    setSelectedDate(date);
  };

  return (
    <div className={classes.root}>
      {showForm && (
        <form className={classes.form} noValidate autoComplete="off">
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
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={inputs.selectedDate}
            onChange={handleDateChange}
            name="selectedDate"
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
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
