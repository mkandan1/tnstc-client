import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

const Head = ({ children }) => {
  return <thead className="bg-white shadow-sm font-normal text-gray-700">{children}</thead>;
};

const Body = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const Row = ({ children }) => {
  return (
    <tr className="transition border-b last:border-none">
      {children}
    </tr>
  );
};

const ColumnTitle = ({ children }) => {
  return (
    <th className="px-4 py-2 text-left font-medium text-gray-400 capitalize tracking-light">
      {children}
    </th>
  );
};

const Cell = ({ children }) => {
  return <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{children}</td>;
};

const DataLoading = ({ headers }) => {
  return (
    <td
      colSpan={headers + 1}
      className="px-4 py-6 text-center text-gray-500"
    >
      <Icon icon={'gg:spinner-two'} className="inline-block mr-2 animate-spin" />
      Loading...
    </td>
  );
};

const NoData = ({ headers = [] }) => {
  return (
    <td
      colSpan={headers.length + 1}
      className="px-4 py-6 text-center text-gray-500"
    >
      No data available
    </td>
  );
};


import { useEffect } from "react";

export const Table = ({ children }) => {

  return (
    <div className="bg-white w-[96vw] lg:w-full shadow overflow-x-auto rounded-md my-4 ">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  );
};


Table.Header = Head;
Table.Body = Body;
Table.Row = Row;
Table.ColumnTitle = ColumnTitle;
Table.Cell = Cell;
Table.NoData = NoData;
Table.DataLoading = DataLoading;
