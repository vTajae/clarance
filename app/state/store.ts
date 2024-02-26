// src/state/store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";


// Function to initialize the store
export const initializeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,

    },
    preloadedState,
  });
};

export type RootState = ReturnType<ReturnType<typeof initializeStore>['getState']>;
export type AppDispatch = ReturnType<typeof initializeStore>['dispatch'];
