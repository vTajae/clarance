// import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch, useRef } from 'react';
// import { QuickBooksService } from '~/services/quickbooks-service';
// import { useAppContext } from './app-context';
// import { UserService } from '~/services/user-service';

// // Define your initial state
// interface QuickbooksState {
//   isAuthenticated: boolean;
//   accessToken: string | null;
//   user_id: string;
// }

// interface QuickbooksContextType {
//     state: QuickbooksState;
//     dispatch: Dispatch<QuickbooksAction>;
//   }
  

// // Define actions to update the context state
// export enum ActionTypes {
//   LOGIN_SUCCESS = 'LOGIN_SUCCESS',
//   LOGOUT = 'LOGOUT',
//   SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
// }

// interface QuickbooksAction {
//   type: ActionTypes;
//   payload?: string;
// }

// const quickbooksReducer = (state: QuickbooksState, action: QuickbooksAction): QuickbooksState => {
//   switch (action.type) {
//     case ActionTypes.LOGIN_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//       };
//     case ActionTypes.LOGOUT:
//       return {
//         ...state,
//         isAuthenticated: false,
//         accessToken: null,
//       };
//     case ActionTypes.SET_ACCESS_TOKEN:
//       return {
//         ...state,
//         accessToken: action.payload || null,
//       };
//     default:
//       return state;
//   }
// }

// const QuickbooksContext = createContext<QuickbooksContextType | undefined>(undefined);

// export const useQuickbooksContext = () => {
//   const context = useContext(QuickbooksContext);
//   if (!context) {
//     throw new Error('useQuickbooksContext must be used within a QuickbooksProvider');
//   }
//   return context;
// };

// interface QuickbooksProviderProps {
//   children: ReactNode;
// }

// export const QuickbooksProvider = ({ children }: QuickbooksProviderProps) => {
//   const appContext = useAppContext();
//   const [state, dispatch] = useReducer(quickbooksReducer, {
//     isAuthenticated: false,
//     accessToken: null,
//     user_id: appContext.state.contextModel.user,
//   });

//   // const appContext = useAppContext();


// // const didFetchAccessToken = useRef(false);

// //   useEffect(() => {
// //     // Check if access token has already been fetched
// //     if (didFetchAccessToken.current) {
// //       return; // Skip fetching if already done
// //     }

// //     // Fetch access token
// //     const fetchAccessToken = async () => {
// //       try {
// //         const response = await QuickBooksService.get_a_Token(); // Replace with the actual method name
// //         if (!response) {
// //           throw new Error("Failed to fetch access token");
// //         }

// //         dispatch({
// //           type: ActionTypes.SET_ACCESS_TOKEN,
// //           payload: response.access_token,
// //         });

// //         // Mark that access token has been fetched
// //         didFetchAccessToken.current = true;
// //       } catch (error) {
// //         console.error("Error fetching access token:", error);
// //       }
// //     };

// //     if (appContext.state.contextModel.user && state.isAuthenticated) {
// //       fetchAccessToken();
// //     }
// //   }, [appContext.state.contextModel.user, state.isAuthenticated, dispatch]);


//   return (
//     <QuickbooksContext.Provider value={{ state, dispatch }}>
//     {children}
//   </QuickbooksContext.Provider>
//   );
// };
