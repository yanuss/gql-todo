import { useMutation } from "@apollo/react-hooks";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import "date-fns";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import ImageInput from "../ImageInput/ImageInput";
import { UPDATE_TODO } from "../Item/Item";
import { GET_TODOS } from "../Items/Items";

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

export const DELETE_CLOUDINARY_IMAGE = gql`
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
      width: "100%",
      maxWidth: 400,
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
  id: string;
  title: string;
  description?: string;
  image: string;
  large_image?: string;
  date?: Date | null;
  done: boolean;
}

const initialInputs = {
  id: "",
  title: "",
  description: "",
  image: "",
  large_image: "",
  date: null,
  done: false
};

interface Props {
  open: boolean;
  itemData: {
    id: string;
    title: string;
    done: boolean;
    image: string;
  };
  handleClose: () => void;
}
interface ItempImages {
  image: string;
  large_image: string | undefined;
}

interface Item {
  id: string;
}

interface Data {
  items: Item[];
}

const CreateItem: React.FunctionComponent<Props> = ({
  open,
  itemData,
  handleClose
}) => {
  const classes = useStyles();
  const [inputs, setInputs] = useState<State>({
    ...initialInputs
  });
  const [imgLoad, setImageLoad] = useState(false);
  const [deleteImage] = useMutation(DELETE_CLOUDINARY_IMAGE);
  const [tempImages, setTempImages] = useState<ItempImages[]>([]);

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
    const files: any = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "gql-todo");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/yanus/image/upload",
        {
          method: "POST",
          body: data
        }
      );
      if (res) {
        const file = await res.json();
        setInputs({
          ...inputs,
          image: file.secure_url,
          large_image: file.eager[0].secure_url
        });
      }
    } catch (err) {
      console.log(err);
    }

    setImageLoad(false);
  };

  const [updateTodo] = useMutation(UPDATE_TODO, {
    variables: { ...inputs },
    refetchQueries: [
      {
        query: GET_TODOS
      }
    ],
    optimisticResponse: {
      __typename: "Mutation",
      updateToDo: {
        id: inputs.id,
        __typename: "Item",
        date: null,
        ...inputs
      }
    },
    onCompleted: () => {
      setInputs({ ...initialInputs });
    }
    // update: (cache, { data }) => {
    //   const existingTodos = cache.readQuery<Data>({
    //     query: GET_TODOS
    //   });
    //   if (existingTodos) {
    //     const updatedItems = existingTodos.items.map(item => {
    //       if (item.id === data.updateTodo.id) {
    //         return data.updateTodo;
    //       } else {
    //         return item;
    //       }
    //     });
    //     cache.writeQuery({
    //       query: GET_TODOS,
    //       data: { items: updatedItems }
    //     });
    //   }
    // }
  });
  const [createItem] = useMutation(ADD_TODO, {
    variables: { ...inputs },
    refetchQueries: [
      {
        query: GET_TODOS
      }
    ],
    optimisticResponse: {
      __typename: "Mutation",
      createItem: {
        __typename: "Item",
        id: Math.round(Math.random() * 10000),
        date: null,
        ...inputs
      }
    },
    update: (cache, { data }) => {
      const getExistingTodos: any = cache.readQuery({ query: GET_TODOS });
      const existingTodos = getExistingTodos ? getExistingTodos.items : [];
      existingTodos.push(data && data.createItem);
      cache.writeQuery({
        query: GET_TODOS,
        data: { items: existingTodos }
      });
    },
    onCompleted: () => {
      setInputs({ ...initialInputs });
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
              alignItems: "flex-end",
              flexWrap: "wrap"
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
              handleClose();
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
