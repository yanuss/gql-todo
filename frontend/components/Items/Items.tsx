import { useQuery } from "@apollo/react-hooks";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import gql from "graphql-tag";
import React, { useState } from "react";
import CreateItem from "../CreateItem/CreateItem";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";

export const GET_TODOS = gql`
  query GET_TODOS {
    items {
      id
      title
      image
      large_image
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
      maxWidth: "500px",
      width: "100%"
    },
    addItemBtn: {
      marginTop: theme.spacing(2)
    }
  })
);

interface Item {
  id: string;
  title: string;
  done: boolean;
  image: string;
}
interface Data {
  items: Item[];
}

const itemDefaults = {
  id: "",
  title: "",
  done: false,
  image: ""
};

const Items: React.FC = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery<Data>(GET_TODOS)!;
  const [showModal, handleShowModal] = useState(false);
  const [modalData, setModalData] = useState<Item>({ ...itemDefaults });
  if (loading) return <CircularProgress />;
  if (error) return <p>error</p>;
  return (
    <div className={classes.root}>
      {data &&
        data.items.map(item => {
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
        handleClose={() => {
          handleShowModal(false);
          setModalData({ ...itemDefaults });
        }}
      />
    </div>
  );
};

export default Items;
