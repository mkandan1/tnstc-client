import React from "react";

const DataTable = ({ headers, data, onEdit, showTotal }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-3">
              <input
                id="select-all-checkbox"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </th>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 font-normal py-3">
                {header.label}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-black">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            <>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b hover:scale-[1.0002] transition-all dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-4 py-3">
                    <input
                      id={`checkbox-${rowIndex}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-gray-800 dark:text-gray-300">
                      {row[header.field] || "-"}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onEdit(row)}
                      className="font-medium bg-white text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {showTotal && (
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <td colSpan={headers.length + 2} className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                    Total: {/* Add logic to compute and display total if applicable */}
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td
                colSpan={headers.length + 2}
                className="px-6 py-4 bg-white text-center text-gray-500 dark:text-gray-400"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;