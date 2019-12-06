// //TODO:...

// import React, { useState } from "react";
// import { useMutation } from "@apollo/react-hooks";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import gql from "graphql-tag";
// import Button from "@material-ui/core/Button";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import { green } from "@material-ui/core/colors";
// import { red } from "@material-ui/core/colors";

// const SIGNNUP_MUTATION = gql`
//   mutation SIGNNUP_MUTATION(
//     $name: String!
//     $email: String!
//     $password: String!
//     $image: String
//   ) {
//     signup(name: $name, email: $email, password: $password, image: $image) {
//       id
//       email
//       name
//     }
//   }
// `;

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     buttonProgress: {
//       color: green[500],
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       marginTop: -17,
//       marginLeft: -17
//     }
//   })
// );

// const SignupButton = props => {
//   const [signup, { data, loading, error }] = useMutation(SIGNNUP_MUTATION, {
//     variables: {
//       name: inputs.name,
//       email: inputs.email,
//       password: inputs.password,
//       image: inputs.image
//     },
//     onCompleted: () => {
//       setInputs({ ...initialInputs });
//     }
//   });

//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       disabled={loading}
//     >
//       Signup
//       {loading && (
//         <CircularProgress size={34} className={classes.buttonProgress} />
//       )}
//     </Button>
//   );
// };
