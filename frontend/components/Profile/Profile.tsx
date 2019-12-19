import React, { useState, useEffect } from "react";
import useForm from "react-hook-form";
import * as yup from "yup";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageInput from "../ImageInput/ImageInput";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Typography from "@material-ui/core/Typography";
import { CURRENT_USER_QUERY } from "../User/User";
import Divider from "@material-ui/core/Divider";
import { useUser } from "../User/User";
import ChangePassword from "./ChangePassword";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import clsx from "clsx";
import { DELETE_CLOUDINARY_IMAGE } from "../CreateItem/CreateItem";

const UPDATE_USER_DETAILS = gql`
  mutation UPDATE_USER_DETAILS(
    $name: String!
    $email: String!
    $image: String
  ) {
    updateUserDetails(name: $name, email: $email, image: $image) {
      name
      email
      image
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(1),
        width: "100%"
      }
    },
    divider: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    btnRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > *": {
        width: "100%"
      },
      "& > :first-child": {
        marginRight: theme.spacing(1)
      }
    },
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
    buttonFailed: {
      backgroundColor: red[500],
      "&:hover": {
        backgroundColor: red[700]
      }
    }
  })
);

const schema = yup.object().shape({
  name: yup.string().required("This field is required"),
  email: yup
    .string()
    .required("This field is required")
    .email("Incorrect Email")
});

const Profile = () => {
  const classes = useStyles();
  const { data: user } = useUser();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [image, setImage] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [imgLoad, setImageLoad] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const [deleteImage] = useMutation(DELETE_CLOUDINARY_IMAGE);
  const { register, handleSubmit, errors, watch, reset } = useForm({
    validationSchema: schema,
    defaultValues: {
      name: user && user.me.name,
      email: user && user.me.email
    }
  });

  useEffect(() => {
    setImage(user.me.image);
    setSuccess(false);
    setFailed(false);
  }, [user.me]);

  const [updateProfile, { loading: loadingMutation, error }] = useMutation(
    UPDATE_USER_DETAILS,
    {
      refetchQueries: [
        {
          query: CURRENT_USER_QUERY
        }
      ],
      onCompleted: () => {
        setSuccess(true);
        deleteTempImages();
      },
      onError: () => setFailed(true)
    }
  );

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLoad(true);
    if (image) {
      const imagesArr = [...tempImages];
      imagesArr.push({ image });
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
    setImage(file.secure_url);
    setImageLoad(false);
  };

  const onSubmit = (data: object, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateProfile({
      variables: {
        name: data.name,
        email: data.email,
        image
      }
    });
  };

  const deleteTempImages = () => {
    tempImages.forEach(el => {
      if (el && el.image) {
        deleteImage({ variables: { image } });
        const imagesArr = [...tempImages];
        imagesArr.shift();
        setTempImages(imagesArr);
      }
    });
  };

  const watchAllFields = watch();
  const saveButtonnClassName = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonFailed]: failed
  });

  return (
    <div className={classes.root}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ImageInput
          image={image}
          loading={imgLoad}
          onDelete={() => setImage("")}
          onClick={uploadFile}
          circle
          avatar
        />
        <TextField
          label="Name"
          name="name"
          autoComplete="current-name"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.name}
          helperText={errors.name && errors.name.message}
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlinedIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="current-email"
          margin="normal"
          variant="outlined"
          size="small"
          error={!!errors.email}
          helperText={errors.email && errors.email.message}
          inputRef={register}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
        />
        {error && (
          <Typography color="error" variant="inherit">
            {error.message.replace("GraphQL error: ", "")}
          </Typography>
        )}
        <div className={classes.btnRow}>
          <Button
            variant="contained"
            onClick={() => reset()}
            disabled={
              watchAllFields.name === user.me.name &&
              watchAllFields.email === user.me.email &&
              image === user.me.image
            }
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={saveButtonnClassName}
            type="submit"
            disabled={
              watchAllFields.name === user.me.name &&
              watchAllFields.email === user.me.email &&
              image === user.me.image
            }
          >
            Save
            {loadingMutation && (
              <CircularProgress size={34} className={classes.buttonProgress} />
            )}
          </Button>
        </div>
      </form>
      <Divider className={classes.divider} />
      {!changePassword ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setChangePassword(true);
          }}
        >
          Change Password
        </Button>
      ) : (
        <ChangePassword showPasswordChange={setChangePassword} />
      )}
    </div>
  );
};

export default Profile;
