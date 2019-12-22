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

interface Props {
  children: (
    data: object,
    loading?: boolean,
    error?: object
  ) => JSX.Element | null;
}

const useUser = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return { data, loading, error };
};
const User = ({ children }: Props) => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return children(data, loading, error);
};

export { CURRENT_USER_QUERY, useUser };
export default User;
