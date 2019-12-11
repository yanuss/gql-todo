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
import Tooltip from "@material-ui/core/Tooltip";

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
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      minWidth: "500px",
      maxWidth: "80%"
      // "& > *": {
      //   margin: theme.spacing(1)
      // }
    },
    addItemBtn: {
      marginTop: theme.spacing(2)
    }
  })
);

const Items = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_TODOS);
  const [showModal, handleShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  if (loading) return <Spinner />;
  if (error) return <p>error</p>;
  return (
    <div className={classes.root}>
      {data.items.map(item => {
        return (
          <React.Fragment key={item.id}>
            <Item
              id={item.id}
              itemData={item}
              setModalData={setModalData}
              handleShowModal={handleShowModal}
            />
            <Divider />
          </React.Fragment>
        );
      })}
      <Tooltip title="Add new item" aria-label="menu">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleShowModal(true)}
          className={classes.addItemBtn}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <CreateItem
        open={showModal}
        itemData={modalData}
        setModalData={setModalData}
        handleClose={() => handleShowModal(false)}
      />
    </div>
  );
};

export default Items;
