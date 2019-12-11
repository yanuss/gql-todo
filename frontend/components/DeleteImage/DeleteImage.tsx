import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const DELETE_IMAGE = gql`
  mutation DELETE_IMAGE($id: String, $image: String, $imageId: String) {
    deleteImage(id: $id, image: $image, imageId: $imageId) {
      message
    }
  }
`;

const useDeleteImage = cb => {
  const [deleteImage, { data, loading, error }] = useMutation(DELETE_IMAGE);
  return { deleteImage, data, loading, error };
};

export default useDeleteImage;
