import { useMutation } from "@apollo/react-hooks";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, red } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { DELETE_CLOUDINARY_IMAGE } from "../CreateItem/CreateItem";
import ImageInput from "../ImageInput/ImageInput";
import { CURRENT_USER_QUERY, useUser } from "../User/User";
import ChangePassword from "./ChangePassword";
import DeleteUser from "./DeleteUser";

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

interface FormData {
  name?: string;
  email?: string;
  image?: string;
}
type Form = {
  name?: string;
  email?: string;
  image?: string;
};

interface Image {
  image: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .max(20, "Input too long")
    .required("This field is required"),
  email: yup
    .string()
    .max(20, "Input too long")
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
  const [tempImages, setTempImages] = useState<Image[]>([]);
  const [deleteImage] = useMutation(DELETE_CLOUDINARY_IMAGE);
  const { register, handleSubmit, errors, watch, reset } = useForm<Form>({
    validationSchema: schema,
    defaultValues: {
      name: user && user.me.name,
      email: user && user.me.email
    }
  });

  useEffect(() => {
    if (user.me.image) {
      setImage(user.me.image);
    }
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
      awaitRefetchQueries: true,
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
      const imagesArr: Array<any> = [...tempImages];
      imagesArr.push({ image });
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
        const file: any = await res.json();
        setImage(file.secure_url);
        setImageLoad(false);
      }
    } catch (err) {
      console.log(err);
    }
    setImageLoad(false);
  };

  const onSubmit = (data: FormData) => {
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
        <div>
          <ImageInput
            image={image}
            loading={imgLoad}
            onDelete={() => setImage("")}
            onClick={uploadFile}
            circle
            // avatar
          />
        </div>
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
      <DeleteUser userId={user.me.userId} />
    </div>
  );
};

export default Profile;
