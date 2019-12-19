// import React from "react";
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

const useUser = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return { data, loading, error };
};
const User = props => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return props.children(data, loading, error);
};

export { CURRENT_USER_QUERY, useUser };
export default User;
