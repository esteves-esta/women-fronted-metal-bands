import * as React from "react";
import { getValueFromRow } from "./getValueFromRow";

function useFilter({
  columns,
  initialRow,
  handleRowChange,
  setCurrentPage,
  setLastPage,
  size,
  rows,
}) {
  const handleFilter = React.useCallback(
    (searchValue: string, colKey: string) => {
      let newRows = [...initialRow];

      if (searchValue) newRows = filterRows(searchValue.toLowerCase(), colKey);

      handleRowChange(newRows);
      setCurrentPage(0);
      setLastPage(Math.ceil(newRows.length / size));
    },
    []
  );

  const filterRows = (searchValue: string, colKey: string) => {
    let newRows = [...rows];
    // console.log({ newRows });
    if (colKey === "all") {
      // return newRows.filter((row) => filterByAllColumn(searchValue, row));
      const filtered = [];
      for (let index = 0; index < newRows.length; index++) {
        const row = newRows[index];
        if (filterByAllColumn(searchValue, row)) filtered.push(row);
      }
      return filtered;
    }

    newRows.sort((rowA, rowB) => rowA[colKey] - rowB[colKey]);
    return newRows.filter((row) => filterByColumn(searchValue, colKey, row));
  };

  const filterByAllColumn = React.useCallback(
    (searchValue: string, row: Array<any>) => {
      const columnsFormatted = [];
      Object.entries(row).forEach((item) => {
        const colInfo = columns.find((col) => col.field === item[0]);
        let value = colInfo ? getValueFromRow(colInfo, row) : item[1];
        colInfo && columnsFormatted.push(value);
      });
      return columnsFormatted.join(" ").indexOf(searchValue) >= 0;
    },
    []
  );

  const filterByColumn = React.useCallback(
    (searchValue: string, colKey: string, row: Array<any>) => {
      const col = columns.find((col) => col.key === colKey);
      if (col) {
        let colValue = getValueFromRow(col, row);
        if (typeof colValue === "number")
          return colValue == Number(searchValue);
        else return colValue.indexOf(searchValue) >= 0;
      }
    },
    []
  );

  return [handleFilter];
}

export default useFilter;
