import * as React from "react";
import { getValueFromRow } from "./getValueFromRow";
import { TableColumn as TableColumnProps } from "./TableProps";

function useSort({
  rows,
  columnsInfo,
  handleColumnChange,
  handleRowChange,
  initialRow
}) {
  React.useEffect(() => {
    const colSort = columnsInfo.findIndex((col) => col.sort != undefined);
    if (colSort >= 0) {
      sortRows(columnsInfo[colSort], colSort, columnsInfo[colSort].sort);
    }
  }, []);

  function handleSortRows(headerInfo: TableColumnProps, colIndex: number) {
    let sort: "desc" | "asc" | undefined;

    const resetCols = columnsInfo.map((col, index) => {
      if (index !== colIndex) {
        col.sort = undefined;
      }
      return col;
    });

    handleColumnChange(resetCols);

    if (columnsInfo[colIndex].sort === "asc") {
      sort = "desc";
    } else if (columnsInfo[colIndex].sort === "desc") {
      sort = undefined;
    } else {
      sort = "asc";
    }

    sortRows(headerInfo, colIndex, sort);
  }

  function sortRows(
    columnInfo: TableColumnProps,
    index: number,
    sort: "asc" | "desc" | undefined
  ) {
    const { field, handleSort } = columnInfo;

    const newColumns = [...columnsInfo];
    newColumns[index].sort = sort;
    handleColumnChange(newColumns);
    if (!sort) {
      handleRowChange([...initialRow]);
      return;
    }

    const sortedData = [...rows];

    if (handleSort && field) {
      sortedData.sort((a, b) =>
        handleSort(
          getValueFromRow(columnInfo, a),
          getValueFromRow(columnInfo, b),
          sort
        )
      );

      handleRowChange(sortedData);
      return;
    }

    sortedData.sort((a, b) => {
      // console.log({ field })
      let formattedA = getValueFromRow(columnInfo, a);
      let formattedB = getValueFromRow(columnInfo, b);

      if (formattedA < formattedB) {
        return sort === "asc" ? -1 : 1;
      }
      if (formattedA > formattedB) {
        return sort === "asc" ? 1 : -1;
      }
      return 0;
    });

    handleRowChange(sortedData);
  }

  return [handleSortRows];
}
export default useSort;
