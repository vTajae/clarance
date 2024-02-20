import {
  configureStore,
  createAsyncThunk,
  createSelector,
  createSlice,
  userSlice_default
} from "/build/_shared/chunk-3VF2BKVT.js";
import {
  createHotContext
} from "/build/_shared/chunk-6OUMGZ45.js";

// app/state/counter/counterSlice.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/counter/counterSlice.tsx"
  );
  import.meta.hot.lastModified = "1703722624787.679";
}
var initialState = {
  value: 0
};
var counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(incrementAsync.pending, () => {
      console.log("incrementAsync.pending");
    }).addCase(
      incrementAsync.fulfilled,
      (state, action) => {
        state.value += action.payload;
      }
    );
  }
});
var incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (amount) => {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    return amount;
  }
);
var { increment, decrement, incrementByAmount } = counterSlice.actions;
var counterSlice_default = counterSlice.reducer;

// app/state/quickbooks/quickbooksSlice.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/quickbooks/quickbooksSlice.tsx"
  );
  import.meta.hot.lastModified = "1703722624795.679";
}
var initialStateValue = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null
};
var quickbooksSlice = createSlice({
  name: "quickbooks",
  initialState: { value: initialStateValue },
  reducers: {
    setAuthentication: (state, action) => {
      state.value.isAuthenticated = action.payload.isAuthenticated;
      state.value.accessToken = action.payload.accessToken;
      state.value.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.value = initialStateValue;
    }
  }
});
var selectQuickbooksUserId = createSelector(
  [(state) => state.user.value.user],
  (user) => user?.id || ""
);
var { setAuthentication, logout } = quickbooksSlice.actions;
var quickbooksSlice_default = quickbooksSlice.reducer;

// app/state/plaid/plaidSlice.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/plaid/plaidSlice.tsx"
  );
  import.meta.hot.lastModified = "1703722624791.679";
}
var initialStateValue2 = {
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
    error_message: ""
  }
};
var plaidSlice = createSlice({
  name: "plaid",
  initialState: { value: initialStateValue2 },
  reducers: {
    setState: (state, action) => {
      return { ...state, ...action.payload };
    },
    // Reducer to add the link token
    addLinkToken: (state, action) => {
      state.value.linkToken = action.payload;
    },
    // Reducer to handle link token errors
    setLinkTokenError: (state, action) => {
      state.value.linkTokenError = action.payload;
    },
    setAccessToken: (state, action) => {
      state.value.itemId = action.payload.itemId;
      state.value.accessToken = action.payload.accessToken;
      state.value.isItemAccess = action.payload.isItemAccess;
    },
    setLinkSuccess: (state, action) => {
      state.value.linkSuccess = action.payload;
    }
  }
});
var { setState, setLinkTokenError, addLinkToken, setAccessToken, setLinkSuccess } = plaidSlice.actions;
var plaidSlice_default = plaidSlice.reducer;

// app/state/store.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/store.ts"
  );
  import.meta.hot.lastModified = "1703885174381.273";
}
var initializeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice_default,
      counter: counterSlice_default,
      quickbooks: quickbooksSlice_default,
      plaid: plaidSlice_default
    },
    preloadedState
  });
};

export {
  initializeStore
};
//# sourceMappingURL=/build/_shared/chunk-5KZFI7EJ.js.map
