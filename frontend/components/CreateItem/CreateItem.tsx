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
import CardMedia from "@material-ui/core/CardMedia";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import ImageInput from "../ImageInput/ImageInput";

import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
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

const DELETE_CLOUDINARY_IMAGE = gql`
  mutation DELETE_CLOUDINARY_IMAGE(
    $id: String
    $image: String
    $imageId: String
  ) {
    deleteCloudinaryImage(id: $id, image: $image, imageId: $imageId) {
      message
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
  })
);

const initialInputs = {
  title: "",
  description: "",
  image: "",
  date: null,
  done: false
};

// interface ImageState {
//   image: string;
//   name: string;
//   large_image: string;
//   public_id: string;
// }

// const blankImageData = {
//   image: "",
//   name: "",
//   large_image: "",
//   public_id: ""
// };

const CreateItem = ({ open, itemData, handleClose, setModalData }) => {
  const [deleteImage] = useMutation(DELETE_CLOUDINARY_IMAGE);
  const classes = useStyles();
  const [inputs, setInputs] = useState({
    ...initialInputs
  });
  // const [imageData, setImageData] = useState<ImageState>({
  //   ...blankImageData
  // });

  useEffect(() => {
    if (itemData.id) {
      setInputs({ ...itemData, done: false });
    }
    // return () => {
    //   if (itemData.image !== inputs.image) {
    //     deleteImageHandler({ image: inputs.image });
    //   }
    // };
  }, [itemData]);

  useEffect(() => {
    if (!open) {
      setInputs({ ...initialInputs });
      // setModalData({});
      // setImageData({ ...blankImageData });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date: Date | null) => {
    setInputs({ ...inputs, date });
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputs.image) {
      deleteImageHandler({ image: inputs.image });
    }
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "gql-todo");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/yanus/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    setInputs({
      ...inputs,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  const [updateTodo] = useMutation(UPDATE_TODO, {
    variables: { ...inputs },
    refetchQueries: [
      {
        query: GET_TODOS
      }
    ],
    onCompleted: () => {
      setInputs({ ...initialInputs });
      // setModalData({});
      handleClose();
    }
  });
  const [createItem] = useMutation(ADD_TODO, {
    variables: { ...inputs },
    refetchQueries: [
      {
        query: GET_TODOS
      }
    ],
    onCompleted: () => {
      setInputs({ ...initialInputs });
      // setModalData({});
      handleClose();
    }
  });

  const deleteImageHandler = async () => {
    let result;
    try {
      result = await deleteImage({
        variables: {
          image: inputs.image
        }
      });
      if (result) {
        setInputs({ ...inputs, image: "", largeImage: "" });
      }
      if (itemData.id) {
        updateTodo();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!itemData.id) {
          deleteImageHandler();
        }
        handleClose();
      }}
      aria-labelledby="form-dialog-title"
    >
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          if (itemData.id) {
            updateTodo();
          } else {
            createItem();
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
        <ImageInput image={inputs.image} onClick={uploadFile} />
        <IconButton onClick={deleteImageHandler}>
          <DeleteIcon />
        </IconButton>
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

// const CREATE_IMAGE = gql`
//   mutation CREATE_IMAGE(
//     $image: String!
//     $name: String
//     $large_image: String
//     $public_id: String
//   ) {
//     createImage(
//       image: $image
//       name: $name
//       large_image: $large_image
//       public_id: $public_id
//     ) {
//       image
//       name
//       large_image
//       public_id
//     }
//   }
// `;

// const createImage = useMutation(CREATE_IMAGE, {
//   variables: {
//     ...imageData
//   },
//   onCompleted: () => {
//     setImageData({ ...blankImageData });
//   }
// });

// const uploadBetterImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (imageData.image) {
//     deleteImageHandler({ image: imageData.image });
//   }
//   const files = e.target.files;
//   const data = new FormData();
//   data.append("file", files[0]);
//   data.append("upload_preset", "gql-todo");
//   const res = await fetch(
//     "https://api.cloudinary.com/v1_1/yanus/image/upload",
//     {
//       method: "POST",
//       body: data
//     }
//   );
//   const file = await res.json();
//   createImage({
//     variables: {
//       image: file.secure_url,
//       large_image: file.eager[0].secure_url,
//       public_id: file.public_id
//     }
//   });
// };
