import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";


interface QuickbooksState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}



const initialStateValue: QuickbooksState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null
};

const quickbooksSlice = createSlice({
  name: 'quickbooks',
  initialState: { value: initialStateValue },
  reducers: {
    setAuthentication: (state, action: PayloadAction<QuickbooksState>) => {
      state.value.isAuthenticated = action.payload.isAuthenticated;
      state.value.accessToken = action.payload.accessToken;
      state.value.refreshToken = action.payload.refreshToken;
    },
      logout: (state) => {
        state.value = initialStateValue;
      }
    },
  });
  


export const selectQuickbooksUserId = createSelector(
  [(state: RootState) => state.user.value.user],
  (user) => user?.id || ''
);





export const { setAuthentication, logout } = quickbooksSlice.actions;
export default quickbooksSlice.reducer;