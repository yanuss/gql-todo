import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import Grow from "@material-ui/core/Grow"; //annimate show hide
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GET_TODOS } from "../Items/Items";

const UPDATE_TODO = gql`
  mutation UPDATE_TODO(
    $id: String!
    $title: String
    $image: String
    $done: Boolean!
    $description: String # $date: DateTime
  ) {
    updateToDo(
      id: $id
      title: $title
      image: $image
      done: $done
      description: $description # date: $date
    ) {
      id
      title
      image
      done
      description
      # date
    }
  }
`;

const GET_SINGLE_TODO = gql`
  query GET_SINGLE_TODO($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      image
      done
      description
      # date
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
      // flexDirection: "column",
      "& > *": {
        margin: theme.spacing(1)
      }
    },
    content: {
      flex: 1
    }
  })
);

const Item = ({ itemData }) => {
  const [updateTodo, { data, loading, error }] = useMutation(UPDATE_TODO);
  const classes = useStyles();
  // console.log(itemData);
  return (
    <div className={classes.root}>
      <Checkbox
        checked={itemData.done}
        onChange={() => {
          updateTodo({
            variables: { id: itemData.id, done: !itemData.done },
            refetchQueries: [
              // {
              //   query: GET_SINGLE_TODO,
              //   variables:{
              //     id: itemData.id,
              //   }
              // }
              {
                query: GET_TODOS
              }
            ]
          });
        }}
        value="checkedA"
        color="primary"
        // inputProps={{
        //   "aria-label": "primary checkbox"
        // }}
      />
      <div className={classes.content}>
        <Box fontWeight="fontWeightBold">{itemData.title}</Box>
        <Box>{itemData.description}</Box>
      </div>
    </div>
  );
};

export default Item;
