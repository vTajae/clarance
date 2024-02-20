import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Adjust this import based on your file structure

// Define TypeScript interface for the Quickstart state
interface plaid {
  linkSuccess: boolean;
  isItemAccess: boolean;
  isPaymentInitiation: boolean;
  linkToken: string | null;
  accessToken: string | null;
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
}

// Define the initial state
const initialStateValue: plaid = {
  linkSuccess: false,
  isItemAccess: true,
  isPaymentInitiation: false,
  linkToken: null,
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
};

const plaidSlice = createSlice({
  name: "plaid",
  initialState: { value: initialStateValue },
  reducers: {
    setState: (state, action: PayloadAction<Partial<plaid>>) => {
      return { ...state, ...action.payload };
    },
    // Reducer to add the link token
    addLinkToken: (state, action: PayloadAction<string | null>) => {
      state.value.linkToken = action.payload;
    },
    // Reducer to handle link token errors
    setLinkTokenError: (state, action: PayloadAction<plaid['linkTokenError']>) => {
      state.value.linkTokenError = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<{ itemId: string, accessToken: string, isItemAccess: boolean }>) => {
      state.value.itemId = action.payload.itemId;
      state.value.accessToken = action.payload.accessToken;
      state.value.isItemAccess = action.payload.isItemAccess;
    },
    setLinkSuccess: (state, action: PayloadAction<boolean>) => {
      state.value.linkSuccess = action.payload;
    },
  },
});

export const { setState, setLinkTokenError, addLinkToken, setAccessToken, setLinkSuccess } = plaidSlice.actions;
export default plaidSlice.reducer;
