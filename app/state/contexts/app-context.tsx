import React, { createContext, useReducer, useEffect } from "react";
import { ContextModel } from "./context-model";
import { UserService } from "../services/user-service";
import { locales } from "../utils/utils";
import { Loader } from "~/shared/withLoader";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ActionTypes } from "./quickbooks-context";

interface AppState {
  contextModel: ContextModel;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_USER"; payload: { user: string } }
  | { type: "UNSET_USER"; payload: { user: string } }

  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } };

const initialState: AppState = {
  contextModel: new ContextModel(),
  isLoading: false,
  error: null,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        contextModel: new ContextModel(
          true,
          action.payload.user,
          locales[0].value
        ),
      };
      case "UNSET_USER":
        return {
          ...state,
          contextModel: new ContextModel(
            false,
            action.payload.user,
            locales[0].value
          ),
        };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload.isLoading };
    case "SET_ERROR":
      return { ...state, error: action.payload.error };
    default:
      return state;
  }
};

const AppContext = createContext<
  { state: AppState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);


export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const history = useNavigate();

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     dispatch({ type: "SET_LOADING", payload: { isLoading: true } });
  //     try {
  //       const response = await UserService.validate();

  //       console.log(response)
  //       const username = response?.username ?? "";
  //       dispatch({ type: "SET_USER", payload: { user: username } });
  //       // FIX ERROR TYPE
  //     } catch (error: any) {
  //       console.error("Error fetching user profile:", error);
  //       dispatch({ type: "SET_ERROR", payload: { error: error.toString() } });
  //     } finally {
  //       dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);
  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     if (state.contextModel.loggedIn) {
  //       return; // Exit if already logged in
  //     }

  //     try {
  //       dispatch({ type: "SET_LOADING", payload: { isLoading: true } });

  //       const userProfile = await UserService.getUserProfile();
  //       if (userProfile && userProfile.username) {
  //         dispatch({ type: "SET_USER", payload: { user: userProfile.username } });
  //       } else {
  //         throw new Error("User profile not found");
  //       }
  //     } catch (error) {
  //       if (true) {
  //         try {
  //           await UserService.MyRefresh();
  //           const refreshedUserProfile = await UserService.getUserProfile();
  //           if (refreshedUserProfile && refreshedUserProfile.username) {
  //             dispatch({
  //               type: "SET_USER",
  //               payload: { user: refreshedUserProfile.username },
  //             });
  //           } else {
  //             throw new Error("User profile not found after refresh");
  //           }
  //         } catch (refreshError) {
  //           console.error("Error during token refresh:", refreshError);
  //           history("/auth/login"); // Redirect to login if refresh also fails
  //         }
  //       } else {
  //         console.error("Error fetching user profile:", error);
  //         history("/auth/login");
  //       }
  //     } finally {
  //       dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
  //     }
  //   };

  //   if (!state.contextModel.loggedIn) {
  //     checkAuthentication();
  //   }
  // }, [state.contextModel.loggedIn, dispatch, history]);


// useEffect(() => {
//   const validateUser = async () => {
//     try {
//       const response = await UserService.getUserProfile();
      
//       if (!response) {
//         throw new Error('Failed to validate user');
//       }
      
//       const userData = await response.json();
//       dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData });
//     } catch (error) {
//       console.error('Error validating user:', error);
//       dispatch({ type: ActionTypes.LOGOUT }); // or any other error handling
//     }
//   };

//   validateUser();
// }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Loader isLoading={state.isLoading}>{children}</Loader>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
