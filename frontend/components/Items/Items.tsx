import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Spinner from "../Spinner/Spinner";
import Item from "../Item/Item";
import CreateItem from "../CreateItem/CreateItem";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const WHOLE_LIST_QUERY = gql`
  query WHOLE_LIST_QUERY {
    items {
      id
      title
      image
      done
      description
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column"
      // "& > *": {
      //   margin: theme.spacing(1)
      // }
    }
  })
);

const Items = props => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(WHOLE_LIST_QUERY);
  if (loading) return <Spinner />;
  if (error) return <p>error</p>;
  return (
    <div className={classes.root}>
      {data.items.map(item => {
        return (
          <>
            <Item data={item} key={item.id} />
            <Divider />
          </>
        );
      })}
      <CreateItem />
    </div>
  );
};

export default Items;
