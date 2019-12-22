// @ts-nocheck
import React, { useRef } from "react";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      width: props => (props.size ? props.size : 128) + 16 + "px"
    },
    button: {
      height: props => (props.size ? props.size : "128px"),
      width: props => (props.size ? props.size : "128px"),
      borderRadius: props => (props.circle ? "50%" : theme.shape.borderRadius),
      position: "relative",
      margin: theme.spacing(1),
      border: props =>
        !props.image && `1px solid ${theme.palette.action.active}`,
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
      borderRadius: props => (props.circle ? "50%" : theme.shape.borderRadius)
    },
    remove: {
      position: "absolute",
      top: "-11px",
      right: "-11px"
    }
  })
);

interface Classes {
  button: object;
  root: object;
  buttonContent: object;
  imageSrc: object;
  remove: object;
}

interface Props {
  image?: string;
  disabled?: boolean;
  loading: boolean;
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDelete: () => void;
  circle?: boolean;
  size?: number;
}

const ImageInput: React.FC<Props> = props => {
  const inputRef = useRef<HTMLInputElement>(null);
  const classes = useStyles(props);

  const handleClick = () => {
    inputRef.current.click();
  };
  return (
    <div className={classes.root}>
      <Tooltip
        title={props.image ? "Change image" : "Add image"}
        aria-label="image options"
        disableHoverListener={props.disabled}
      >
        <span>
          <ButtonBase
            className={classes.button}
            onClick={() => {
              handleClick();
            }}
            disabled={props.loading || props.disabled}
          >
            <div className={classes.buttonContent}>
              <input
                type="file"
                name="picture"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={props.onClick}
              />
              {props.loading && <CircularProgress size={34} />}
              {props.image && !props.loading && (
                <span className={classes.imageSrc} />
              )}
              {!props.loading && !props.image && (
                <InsertPhotoIcon fontSize="large" />
              )}
            </div>
          </ButtonBase>
        </span>
      </Tooltip>
      {props.image && !props.disabled && (
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
