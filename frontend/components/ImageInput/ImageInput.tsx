import React, { useRef } from "react";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: props => (props.size ? props.size : "128px"),
      width: props => (props.size ? props.size : "128px")
    },
    buttonContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      padding: "4px",
      "&:hover": {
        backgroundColor: theme.palette.action.hover
      }
    },
    imageSrc: {
      backgroundImage: props => `url(${props.image})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      width: "100%",
      height: "100%",
      padding: "4px",
      borderRadius: "10%"
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
  );
};

export default ImageInput;
