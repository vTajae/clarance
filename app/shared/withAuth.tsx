// import React, { useContext, useEffect, useState } from "react";
// import { AppContext } from "../contexts/app-context"; // Adjust the import path as needed
// import { UserService } from "../services/user_service"; // Adjust as needed
// import { ContextModel } from "~/contexts/context-model";
// import { locales } from "../shared/utils"; // Import locales here if needed
// import { JSX } from "react/jsx-runtime";
// import { useNavigate } from "@remix-run/react";

// // This HOC takes a component and returns a new component
// const withAuth = (WrappedComponent: React.ComponentType) => {
//   return (props: JSX.IntrinsicAttributes) => {
//     // const { contextModel, setContextModel } = useContext(AppContext);
//     const [locale, setLocale] = useState(locales[0]);
//     const history = useNavigate();

//     // useEffect(() => {
//     //   if (!contextModel.loggedIn) {
//     //     UserService.getUserProfile()
//     //       .then(userProfile => {
//     //         if (userProfile && userProfile.id) {
//     //           // Updating the context with user details
//     //         const updatedContextModel = new ContextModel(
//     //             true, // loggedIn
//     //             userProfile.username, // username
//     //             locale.value // current locale
//     //           );
//     //           setContextModel(updatedContextModel);

//     //         } else {
//     //           // Handle redirection or display a message for unauthorized access
//     //           // redirect to login or show an error, etc.

//     //           history('/auth/login');
//     //         }
//     //       })
//     //       .catch(error => {
//     //         console.error('Error fetching user profile:', error);
//     //         // Handle redirection or error
//     //       });
//     //   } else {
//     //   }
//     // }, [contextModel.loggedIn, setContextModel]);

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;
