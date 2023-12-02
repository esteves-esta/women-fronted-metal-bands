import * as React from 'react';
import { range } from '../../helpers/range';
import * as classes from './Table.module.css';
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { TableColumn } from './TableProps';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import Tag from '../Tag';
import { getValueFromRow } from './getValueFromRow';

function Table({
  columnsInfo,
  rows,
  size,
  currentPage,
  setColumnsInfo,
  handleRowChange,
  initialRow
}) {

  React.useEffect(() => {
    const colSort = columnsInfo.findIndex(col => col.sort != undefined)
    if (colSort >= 0) {
      sortRows(columnsInfo[colSort], colSort, columnsInfo[colSort].sort)
    }
  }, [])

  function handleSortRows(headerInfo: TableColumn, colIndex: number) {
    let sort: 'desc' | 'asc' | undefined;

    const resetCols = columnsInfo.map((col, index) => {
      if (index !== colIndex) {
        col.sort = undefined;
      }
      return col;
    })

    setColumnsInfo(resetCols)

    if (columnsInfo[colIndex].sort === 'asc') {
      sort = 'desc';
    } else if (columnsInfo[colIndex].sort === 'desc') {
      sort = undefined
    } else { sort = 'asc'; }

    sortRows(headerInfo, colIndex, sort);
  }

  function sortRows(columnInfo: TableColumn, index: number, sort: 'asc' | 'desc' | undefined) {
    const { field, handleSort } = columnInfo;

    const newColumns = [...columnsInfo]
    newColumns[index].sort = sort
    setColumnsInfo(newColumns);
    if (!sort) {
      handleRowChange([...initialRow]);
      return
    };

    const sortedData = [...rows]
    if (handleSort && field) {
      sortedData.sort((a, b) => handleSort(
        getValueFromRow(columnInfo, a),
        getValueFromRow(columnInfo, b), sort
      )
      );

      handleRowChange(sortedData)
      return;
    }

    sortedData.sort((a, b) => {
      // console.log({ field })
      let formattedA = getValueFromRow(columnInfo, a);
      let formattedB = getValueFromRow(columnInfo, b);

      if (formattedA < formattedB) {
        return sort === 'asc' ? -1 : 1;
      }
      if (formattedA > formattedB) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    });

    handleRowChange(sortedData)
  }

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {columnsInfo.map((headerInfo, index) => headerInfo.visible && (
            <th key={headerInfo.key}>
              <TableHeader headerInfo={headerInfo} sortRows={() => handleSortRows(headerInfo, index)} />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        <TableRow
          currentPage={currentPage}
          size={size}
          rows={rows}
          columns={columnsInfo}
        />
      </tbody>
    </table>
  )
}

function TableHeader({ headerInfo, sortRows }: { headerInfo: TableColumn, sortRows: (string) => void }) {
  const { sortable, headerLabel, sort } = headerInfo

  if (sortable) {
    return <React.Fragment>
      {sortable && <button onClick={sortRows} className={classes.sortBtn}>
        {!sort && <ArrowUpDown size={15} />}
        {sort === 'asc' && <ArrowUpAZ size={15} />}
        {sort === 'desc' && <ArrowDownAZ size={15} />}
        <VisuallyHidden.Root>
          Toggle sorting{' '}
          {sort || 'off'}
        </VisuallyHidden.Root>
        {headerLabel}
      </button>}
    </React.Fragment>
  }

  return (<React.Fragment>{headerLabel}</React.Fragment>)
}

function TableRow({ currentPage, size, rows, columns }) {
  const start = currentPage * size;
  const end = size * (currentPage + 1);

  return (
    <React.Fragment>
      {range(start, end).map((rowIndex) => rowIndex < rows.length && (
        <tr key={rowIndex}>
          <TableColumns rows={rows} rowIndex={rowIndex} columns={columns} />
        </tr>
      ))}
    </React.Fragment>
  )

}

function TableColumns({ columns, rowIndex, rows }: {
  columns: TableColumn[], rowIndex: number, rows: Array<any>
}) {
  const row = rows[rowIndex]
  return <React.Fragment>
    {columns.map((columnInfo, index) => columnInfo.visible && (
      <td key={`${columnInfo.key}${index}`}>
        <TableColumn row={row} columnInfo={columnInfo} />
      </td>
    ))}
  </React.Fragment>
}

function TableColumn({ row, columnInfo }: {
  row: any, columnInfo: TableColumn
}) {
  const { field, formatElement, format, tag, tagList } = columnInfo

  if (tag && tagList) {
    if (field) return (<Tag value={row[field]} tagInfo={tagList} />)
    if (format) return (<Tag value={format(row)} tagInfo={tagList} />)
  }

  if (format) return <React.Fragment>{format(row)}</React.Fragment>

  if (formatElement) {
    return (<React.Fragment>
      {formatElement(row)}
    </React.Fragment>)
  }

  if (field) {
    const colValue = row[field] ? row[field] : '-'
    if (Array.isArray(colValue)) {
      if (colValue.length === 0) return (<React.Fragment>-</React.Fragment>);

      const values = colValue.map((col, index) => (
        <p key={index}>{col}{colValue.length - 1 > index && ','}</p>
      ))
      return <React.Fragment>{values}</React.Fragment>
    }
    return <React.Fragment>{colValue}</React.Fragment>
  }

  return <React.Fragment>-</React.Fragment>
}



export default Table;