import './DataTable.css';

const DataTable = ({ columns, rows, emptyText = 'No data available', rowKey = '_id' }) => {
  return (
    <div className="table-wrap panel">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row[rowKey] || row.id}>
                {columns.map((column) => (
                  <td key={`${row[rowKey] || row.id}-${column.key}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty-cell" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
