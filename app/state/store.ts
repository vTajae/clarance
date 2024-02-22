// src/state/store.js

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import userReducer from "./user/userSlice";


// Function to initialize the store
export const initializeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      counter: counterReducer,

    },
    preloadedState,
  });
};

export type RootState = ReturnType<ReturnType<typeof initializeStore>['getState']>;
export type AppDispatch = ReturnType<typeof initializeStore>['dispatch'];
