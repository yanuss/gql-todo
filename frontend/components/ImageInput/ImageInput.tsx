import React, { useRef } from "react";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: props => (props.size ? props.size : "128px"),
      width: props => (props.size ? props.size : "128px"),
      borderRadius: theme.shape.borderRadius,
      position: "relative",
      margin: theme.spacing(1),
      "&:hover": {
        backgroundColor: theme.palette.action.hover
      }
    },

    buttonContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      padding: "4px"
    },
    imageSrc: {
      backgroundImage: props => `url(${props.image})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      height: props => (props.size ? props.size : 128) - 8 + "px",
      width: props => (props.size ? props.size : 128) - 8 + "px",
      padding: "4px",
      borderRadius: "10%"
    },
    remove: {
      position: "absolute",
      top: "-11px",
      right: "-11px"
    }
  })
);

const ImageInput = props => {
  const inputRef = useRef(null);
  const classes = useStyles(props);

  const handleClick = () => {
    inputRef.current.click();
  };
  return (
    <div style={{ position: "relative" }}>
      <Tooltip
        title={props.image ? "Change image" : "Add image"}
        aria-label="add image"
      >
        <ButtonBase
          className={classes.button}
          onClick={() => {
            handleClick();
          }}
        >
          <div className={classes.buttonContent}>
            <input
              type="file"
              name="picture"
              ref={inputRef}
              style={{ display: "none" }}
              onChange={props.onClick}
            />
            {props.image ? (
              <span className={classes.imageSrc} />
            ) : (
              <InsertPhotoIcon fontSize="large" />
            )}
          </div>
        </ButtonBase>
      </Tooltip>
      {props.image && (
        <Tooltip title="Delete image" aria-label="delete image">
          <IconButton
            aria-label="delete"
            className={classes.remove}
            onClick={props.onDelete}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default ImageInput;
