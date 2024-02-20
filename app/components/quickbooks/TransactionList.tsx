export const TransactionListReport = ({ reportData }: { reportData: any }) => {
  const { data } = reportData.reportData;

  console.log(data[0].Rows)

  if (!data || !Array.isArray(data) || data.length === 0 || !data[0].Columns || !data[0].Rows) {
    return (
      <div className="p-6 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Transaction List</h1>
        <p>No data available</p>
      </div>
    );
  }

  const columns = data[0].Columns.Column;

  console.log(columns,"columnss")
  const rows = data[0].Rows.Row;

  return (
    <div className="p-6 mx-auto">
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Transaction List</h1>
    <table>
      <thead>
        <tr className="bg-gray-100 text-gray-700 font-semibold">
          {columns.map((column: any, index: number) => (
            <th key={index}>{column.ColTitle}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row: any, rowIndex: number) => (
          <tr key={rowIndex} className="bg-white border-b">
            {row.ColData.map((col:any, colIndex:number) => (
              <td key={colIndex} className="p-2 text-gray-600">{col.value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};
