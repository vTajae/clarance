import React from "react";
import {
  Column,
  Row,
  ColData,
} from "../../../api/models/quickbooks-Reports/CashFlowReport";

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="bg-white border-b">{children}</tr>
);

const TableCell = ({
  children,
  colSpan = 1,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) => (
  <td colSpan={colSpan} className="p-2 text-gray-600">
    {children}
  </td>
);

const TableHeader = ({ columns }: { columns: Column[] }) => (
  <thead>
    <tr className="bg-gray-100 text-gray-700 font-semibold">
      {columns.map((column, index) => (
        <th key={index}>{column.ColTitle}</th>
      ))}
    </tr>
  </thead>
);

const renderRowData = (colData: ColData[]) => {
  return colData.map((col, index) => (
    <TableCell key={index}>{col.value}</TableCell>
  ));
};

const renderRows = (rows: Row[]) => {
  console.log(rows);

  return rows.map((row, index) => (
    <React.Fragment key={index}>
      {row.Header && (
        <TableRow>
          <TableCell colSpan={2}>{row.Header.ColData[0].value}</TableCell>
        </TableRow>
      )}
      {row.ColData && <TableRow>{renderRowData(row.ColData)}</TableRow>}
      {row.Rows && row.Rows.Row && (
        <TableRow>
          <TableCell colSpan={2}>
            <table>
              <tbody>{renderRows(row.Rows.Row)}</tbody>
            </table>
          </TableCell>
        </TableRow>
      )}
      {row.Summary && <TableRow>{renderRowData(row.Summary.ColData)}</TableRow>}
    </React.Fragment>
  ));
};

export const CashFlowReport = ({ reportData }: { reportData: any }) => {
  const { data } = reportData.reportData;
  if (!reportData || !data[0].Rows || !data[0].Rows) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {data[0]?.Header.ReportName}
        </h1>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        {data[0].Header.ReportName}
      </h1>
      <table>
        <TableHeader columns={data[0].Columns} />
        <tbody>{renderRows(data[0].Rows.Row)}</tbody>
      </table>
    </div>
  );
};

export default CashFlowReport;
