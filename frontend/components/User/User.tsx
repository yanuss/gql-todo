import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      image
      email
      name
      permissions
    }
  }
`;

const User = props => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  // console.log(data);
  return props.children(data, loading, error);
};

export default User;
export { CURRENT_USER_QUERY };
