import type { TableProps } from "../../../../types/table/table";

export const Table = ({ headers, data, width, height }: TableProps) => {
  return (
    <div className="table-container">
      <table
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
        className="dynamic-table"
      >
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((headerKey, colIndex) => (
                <td key={colIndex}>{row[headerKey] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
