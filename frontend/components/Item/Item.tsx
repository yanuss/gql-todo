// @ts-nocheck
import { useMutation } from "@apollo/react-hooks";
import ButtonBase from "@material-ui/core/ButtonBase";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import Edit from "@material-ui/icons/Edit";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import clsx from "clsx";
import gql from "graphql-tag";
import React from "react";
import DeleteTodo from "../DeleteTodo/DeleteTodo";
import { GET_TODOS } from "../Items/Items";

export const UPDATE_TODO = gql`
  mutation UPDATE_TODO(
    $id: String!
    $title: String!
    $image: String
    $done: Boolean!
    $description: String
    $large_image: String
    $date: DateTime
  ) {
    updateToDo(
      id: $id
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

const GET_SINGLE_TODO = gql`
  query GET_SINGLE_TODO($id: ID!) {
    item(where: { id: $id }) {
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      "&:after": {
        content: " ",
        position: "absolute",
        borderBottom: `${theme.spacing(0.5)} solid ${theme.palette.text}`
      },
      "& > *s": {
        margin: theme.spacing(1)
      }
    },
    paper: {
      width: "100%",
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    content: {
      flex: 1
    },
    done: {
      textDecoration: props => (props.done ? "line-through" : "none")
    },
    image: {
      position: "relative",
      height: 44,
      padding: "6px"
    },
    imageSrc: {
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      width: "38px",
      height: "38px",

      borderRadius: "10%"
    }
  })
);

const Item = ({ itemData, setModalData, handleShowModal }) => {
  const [updateTodo, { data, loading, error }] = useMutation(UPDATE_TODO);
  const classes = useStyles(itemData);

  return (
    <Paper className={classes.paper}>
      <div className={classes.root}>
        <IconButton
          aria-label="check"
          onClick={() => {
            updateTodo({
              variables: {
                id: itemData.id,
                done: !itemData.done,
                title: itemData.title,
                image: itemData.image
              },
              refetchQueries: [
                {
                  query: GET_TODOS
                }
              ],
              optimisticResponse: {
                __typename: "Mutation",
                updateToDo: {
                  id: itemData.id,
                  __typename: "Item",
                  date: null,
                  ...itemData,
                  done: !itemData.done
                }
              }
              // update: (cache, { data }) => {
              //   console.log(data.updateToDo.done);
              //   const existingTodos: any = cache.readQuery({
              //     query: GET_TODOS
              //   });
              //   const updatedList = [...existingTodos.items].map(item => {
              //     if (item.id === data.updateToDo.id) {
              //       return data.updateToDo;
              //     } else {
              //       return item;
              //     }
              //   });
              //   cache.writeQuery({
              //     query: GET_TODOS,
              //     data: { items: updatedList }
              //   });
              // }
            });
          }}
        >
          {itemData.done ? (
            <DoneIcon fontSize="small" />
          ) : (
            <RadioButtonUncheckedIcon fontSize="small" />
          )}
        </IconButton>
        <div className={clsx(classes.content, classes.done)}>
          <Typography variant="h6">{itemData.title}</Typography>
          <Typography variant="body1">{itemData.description}</Typography>
        </div>
        <ButtonBase focusRipple key={itemData.title} className={classes.image}>
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${itemData.image})`
            }}
          />
        </ButtonBase>
        <Tooltip title="Edit item" aria-label="menu">
          <IconButton
            aria-label="delete"
            onClick={() => {
              setModalData({
                ...itemData
              });
              handleShowModal(true);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <DeleteTodo id={itemData.id} />
      </div>
    </Paper>
  );
};

export default Item;
