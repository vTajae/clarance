import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import { TransactionListDataProps } from "api/models/quickbooks-Reports/TransactionListReport";
import { CashFlowReportDataProps } from "api/models/quickbooks-Reports/CashFlowReport";
import { AgedPayableDetailDataProps } from "api/models/quickbooks-Reports/AgedPayableDetail";
import { GeneralLedgerReportDataProps } from "api/models/quickbooks-Reports/GeneralLedger";
import { QuickBooksQueryInvoiceReportDataProps } from "api/models/quickbooks-Reports/QueryInvoice";


export type ReportDataProps = 
  TransactionListDataProps | 
  CashFlowReportDataProps | 
  AgedPayableDetailDataProps | 
  GeneralLedgerReportDataProps | 
  QuickBooksQueryInvoiceReportDataProps;


interface ReportState {
  reportJson: ReportDataProps | null;
  reportTimestamp: string | null;
  reportId: string | null;
  reportType: string | null; // Add report type
}

  // Assuming ReportType is a type that includes "CashFlow", "TransactionList", etc.
export type ReportType = "CashFlow" | "TransactionList" | "Invoice" | "AgedPayableDetail" | "GeneralLedger" | "ProfitAndLossDetail" | null ;
  

const initialStateValue: ReportState = {
  reportJson: null,
  reportTimestamp: null,
  reportId: null,
  reportType: null, // Add report type,
};

const reportSlice = createSlice({
  name: "report",
  initialState: { value: initialStateValue },
  reducers: {
    setReportJson: (state, action: PayloadAction<ReportState>) => {
      state.value.reportJson = action.payload.reportJson;
      state.value.reportTimestamp = new Date().toISOString();
      state.value.reportId = uuidv4(); // Generate a new unique ID for the report
      state.value.reportType = action.payload.reportType; // Set the report type
    },
    clearReport: (state) => {
      state.value.reportJson = null;
      state.value.reportTimestamp = null;
      state.value.reportId = null;
      state.value.reportType = null;
    },
    setReportType: (state, action: PayloadAction<string>) => {
      console.log(action.payload, "action.payload");
      state.value.reportType = action.payload;
    }

  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => {
      // Check if the report is older than 24 hours and clear it
      if (state.value.reportTimestamp) {
        const reportAge =
          Date.now() - new Date(state.value.reportTimestamp).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (reportAge > twentyFourHours) {
          state.value.reportJson = null;
          state.value.reportTimestamp = null;
          state.value.reportId = null;
          state.value.reportType = null;
        }
      }
    });
  },
});

// Selectors
export const selectReportJson = (state: RootState) =>
  state.quickbooks_report.value.reportJson;
export const selectReportTimestamp = (state: RootState) =>
  state.quickbooks_report.value.reportTimestamp;
export const selectReportId = (state: RootState) =>
  state.quickbooks_report.value.reportId;
export const selectReportType = (state: RootState) =>
  state.quickbooks_report.value.reportType;

export const { setReportJson, clearReport, setReportType } = reportSlice.actions;

export default reportSlice.reducer;
