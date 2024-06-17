// src/state/store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import stepperReducer from "./user/formSice";


// Function to initialize the store
export const initializeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      stepper: stepperReducer
    },
    preloadedState,
  });
};

export type RootState = ReturnType<ReturnType<typeof initializeStore>['getState']>;
export type AppDispatch = ReturnType<typeof initializeStore>['dispatch'];
