import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Balances {
    available: number | null;
    current: number;
    iso_currency_code: string;
    limit: number | null;
    unofficial_currency_code: string| null;
  }
  
  export interface Account {
    account_id: string;
    balances: Balances;
    mask: string;
    name: string;
    official_name: string;
    subtype: string;
    type: string;
  }
  
  export interface Item {
    available_products: string[] | null;
    billed_products: string[];
    consent_expiration_time: string | null;
    error: string | null;
    institution_id: string;
    item_id: string;
    webhook: string;
    update_type?: string | null;
    products?: string[] | null;
  }
  
  export interface PlaidResponse {
    accounts: Account[];
    item: Item;
    request_id: string;
  }
  
  

  

// Initial state
const initialStateValue: PlaidResponse = {
  accounts: [], // Start with an empty array or pre-fill with initial data
  item: {
    item_id: '', // Empty string or a default value
    webhook: '', // Empty string if no default webhook URL
    error: null, // Initialize as null, assuming 'error' is an object or null
    available_products: [], // Empty array if no default products
    billed_products: [], // Empty array if no default billed products
    consent_expiration_time: null, // Null if no default expiration time
    update_type: 'background', // Default value or empty string
    institution_id: '', // Empty string or a default institution ID
    products: [], // Empty array if no default products
  },
  request_id: ''
};

const plaidSlice = createSlice({
    name: 'plaid',
    initialState: { value: initialStateValue },
    reducers: {
      setAccounts: (state, action: PayloadAction<Account[]>) => {
        state.value.accounts = action.payload;
      },
      updateAccount: (state, action: PayloadAction<Account>) => {
        const index = state.value.accounts.findIndex(account => account.account_id === action.payload.account_id);
        if (index !== -1) {
          state.value.accounts[index] = action.payload;
        } else {
          state.value.accounts.push(action.payload);
        }
      },
      removeAccount: (state, action: PayloadAction<string>) => {
        state.value.accounts = state.value.accounts.filter(account => account.account_id !== action.payload);
      },
      setItem: (state, action: PayloadAction<Item>) => {
        state.value.item = action.payload;
      },
      setRequestId: (state, action: PayloadAction<string>) => {
        state.value.request_id = action.payload;
      },
      // More reducers as needed for handling different actions
    }
  });
  
  export const { setAccounts, updateAccount, removeAccount, setItem, setRequestId } = plaidSlice.actions;
  export default plaidSlice.reducer;
  