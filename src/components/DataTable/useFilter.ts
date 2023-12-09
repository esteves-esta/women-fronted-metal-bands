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

      if (searchValue) newRows = filterRows(searchValue, colKey);

      handleRowChange(newRows);
      setCurrentPage(0);
      setLastPage(Math.ceil(newRows.length / size));
    },
    []
  );

  const filterRows = (searchValue: string, colKey: string) => {
    let newRows = [...rows];

    if (colKey === "all")
      return newRows.filter((row) => filterByAllColumn(searchValue, row));

    newRows.sort((rowA, rowB) => rowA[colKey] - rowB[colKey]);
    return newRows.filter((row) => filterByColumn(searchValue, colKey, row));
  };
  const filterByAllColumn = React.useCallback(
    (searchValue: string, row: Array<any>) => {
      const columnsVisible = Object.entries(row).filter((item) =>
        columns.find((col) => col.field === item[0])
      );
      const valuesNotBoolean = columnsVisible
        .filter((item) => typeof item[1] !== "boolean")
        .map((item) => item[1]);

      const formattedColumns = columns.filter((col) => !!col.format);
      const formattedRow = formattedColumns.map(
        (col) => col.format && col.format(row)
      );

      return valuesNotBoolean
        .concat(formattedRow)
        .join(" ")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
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
        else return colValue.includes(searchValue.toLowerCase());
      }
    },
    []
  );

  return [handleFilter];
}

export default useFilter;
