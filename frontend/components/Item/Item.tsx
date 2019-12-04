import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import gql from "graphql-tag";
import Grow from "@material-ui/core/Grow"; //annimate show hide
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// const ITEM_DONE_MUTATION = gql``;

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

const Item = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Checkbox
        checked={data.done}
        onChange={() => console.log("click")}
        value="checkedA"
        color="primary"
        // inputProps={{
        //   "aria-label": "primary checkbox"
        // }}
      />
      <div className={classes.content}>
        <Box fontWeight="fontWeightBold">{data.title}</Box>
        <Box>{data.description}</Box>
      </div>
    </div>
  );
};

export default Item;
