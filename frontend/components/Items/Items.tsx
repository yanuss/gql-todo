import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Spinner from "../Spinner/Spinner";
import Item from "../Item/Item";
import CreateItem from "../CreateItem/CreateItem";
import Divider from "@material-ui/core/Divider";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";

export const GET_TODOS = gql`
  query GET_TODOS {
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
      alignContent: "center",
      justifyContent: "center",
      flexDirection: "column",
      maxWidth: "500px"
      // "& > *": {
      //   margin: theme.spacing(1)
      // }
    }
  })
);

const Items = props => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_TODOS);
  const [showModal, handleShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  if (loading) return <Spinner />;
  if (error) return <p>error</p>;
  return (
    <div className={classes.root}>
      {/* <Grid container direction="column" justify="flex-start" alignItems="center"> */}
      {data.items.map(item => {
        return (
          <React.Fragment key={item.id}>
            <Item
              itemData={item}
              setModalData={setModalData}
              handleShowModal={handleShowModal}
            />
            <Divider />
          </React.Fragment>
        );
      })}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleShowModal(true)}
      >
        <AddIcon />
      </Fab>
      <CreateItem
        open={showModal}
        itemData={modalData}
        handleClose={() => handleShowModal(false)}
      />
      {/* </Grid> */}
    </div>
  );
};

export default Items;
