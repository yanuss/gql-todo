import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import { GET_TODOS } from "../Items/Items";
import ImageInput from "../ImageInput/ImageInput";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

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
    $done: Boolean!
    $description: String
    $large_image: String
    $date: DateTime
  ) {
    createItem(
      title: $title
      image: $image
      done: $done
      description: $description
      large_image: $large_image
      date: $date
    ) {
      id
      title
      image
      large_image
      done
      description
      date
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
      // margin: theme.spacing(2),s
      width: 400,
      "& > *": {
        display: "block"
      }
    },
    textField: {
      display: "flex"
    }
  })
);

interface State {
  title: string;
  description?: string;
  image?: string;
  large_image?: string;
  date?: object;
  done: boolean;
}

const initialInputs = {
  title: "",
  description: "",
  image: "",
  large_image: "",
  date: null,
  done: false
};

const CreateItem = ({
  open,
  itemData,
  handleClose,
  setModalData,
  editItem
}) => {
  const classes = useStyles();
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });
  const [imgLoad, setImageLoad] = useState(false);
  const [deleteImage] = useMutation(DELETE_CLOUDINARY_IMAGE);
  const [tempImages, setTempImages] = useState([]);

  useEffect(() => {
    setTempImages([]);
    if (itemData.id) {
      setInputs({ ...itemData });
    } else {
      setInputs({ ...initialInputs });
    }
  }, [itemData, open]);

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
    setImageLoad(true);
    if (inputs.image) {
      const imagesArr = [...tempImages];
      imagesArr.push({ image: inputs.image, large_image: inputs.large_image });
      setTempImages(imagesArr);
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
      large_image: file.eager[0].secure_url
    });
    setImageLoad(false);
  };

  const [updateTodo] = useMutation(UPDATE_TODO, {
    variables: { ...inputs },
    refetchQueries: [
      {
        query: GET_TODOS
      }
    ],
    onCompleted: data => {
      setInputs({ ...initialInputs });
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
    onCompleted: data => {
      setInputs({ ...initialInputs });
      handleClose();
    }
  });

  const deleteTempImages = () => {
    tempImages.forEach(el => {
      if (el && el.image) {
        deleteImage({ variables: { image: el.image } });
        const imagesArr = [...tempImages];
        imagesArr.shift();
        setTempImages(imagesArr);
      }
    });
  };

  const deleteCurrentImage = () => {
    if (inputs.image) {
      deleteImage({ variables: { image: inputs.image } });
    }
    setInputs({
      ...inputs,
      image: "",
      large_image: ""
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!itemData.id) {
          deleteCurrentImage();
        } else if (itemData.id) {
          const imagesArr = [...tempImages];
          imagesArr.shift();
          setTempImages(imagesArr);
        }
        deleteTempImages();
        handleClose();
      }}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            label="Title"
            name="title"
            value={inputs.title}
            onChange={handleChange}
            className={classes.textField}
          />
          <TextField
            label="Description"
            name="description"
            value={inputs.description}
            onChange={handleChange}
            className={classes.textField}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >
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
            <ImageInput
              image={inputs.image}
              onClick={uploadFile}
              onDelete={() => {
                const imagesArr = [...tempImages];
                imagesArr.push({
                  image: inputs.image,
                  large_image: inputs.large_image
                });
                setTempImages(imagesArr);
              }}
              loading={imgLoad}
            />
          </div>
        </form>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!inputs.title}
            onClick={() => {
              if (itemData.id) {
                updateTodo();
              } else {
                createItem();
              }
              deleteTempImages();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItem;
