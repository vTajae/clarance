import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../../../api/services/user_service"; // Adjust the path to your auth service
import { Credentials } from "~/props/credentials";

// // Define TypeScript interfaces for your user model and tokens
export interface UserModel {
  id: number;
  username: string;
}

export interface UserContext {
  isLoading: boolean;
  isLoggedIn: boolean;
  locale: string;
  error: string | null;
}

// // Define the state structure
export interface UserState {
  user: UserModel | null;
  context: UserContext;
}

const initialStateValue: UserState = {
  user: null,
  context: {
    isLoading: true,
    isLoggedIn: false,
    locale: "en-US",
    error: null,
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: { value: initialStateValue },
  reducers: {
    setUser: (state, action: PayloadAction<UserModel>) => {
      state.value.user = action.payload;
      state.value.context.isLoggedIn = true;
      state.value.context.isLoading = false;
      state.value.context.error = null;
    },
    setLogout: (state) => {
      state.value.user = null;
      state.value.context.isLoggedIn = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.value.context.isLoading = action.payload;
    },
    // Optionally, you can add a reset action to set the state back to its initial value
    resetState: (state) => {
      state.value = initialStateValue;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.value.user = action.payload;
        state.value.context.isLoggedIn = true;
        state.value.context.isLoading = false;
        state.value.context.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // Handle failed login attempt
        state.value.context.error = "Login failed";
        state.value.context.isLoading = false;
      });
  },
});

// In your Redux slice or action file
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials: any, { dispatch }) => {
    try {
      const response = await UserService.loginUser(
        credentials.username,
        credentials.password
      );
      const user = response.user;
      dispatch(setUser(user)); // Update Redux state
      return user;
    } catch (error) {
      throw error;
    }
  }
);

// Update the selectors to reflect the new structure
export const selectIsLoggedIn = (state: RootState) =>
  state.user.value.context.isLoggedIn;
export const selectIsLoading = (state: RootState) => state.user.value.context.isLoading;

export const { setUser, setLogout, setLoading, resetState } = userSlice.actions;

export default userSlice.reducer;
