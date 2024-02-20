import React from 'react'
import { TransactionListReport } from './TransactionList';
import CashFlowReport from './CashFlow';
import { TransactionListDataProps } from '../../../api/models/quickbooks-Reports/TransactionListReport';
import { CashFlowReportDataProps } from '../../../api/models/quickbooks-Reports/CashFlowReport';

export const Controller: React.FC<{ reportData: any }> = ({ reportData }) => {
    const {data } = reportData.reportData;

    // console.log(data[0], "hellooo")
    
    console.log(data[0].Header.ReportName);
    
    switch (data[0].Header.ReportName) {
        case "TransactionList":
          return (
            <TransactionListReport
              reportData={reportData as TransactionListDataProps}
            />
          );
        case "CashFlow":
          return (
            <CashFlowReport
              reportData={reportData as CashFlowReportDataProps}
            />
          );
        default:
          return <div>No report available.</div>;
      }
}

