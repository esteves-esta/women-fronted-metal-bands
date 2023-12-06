import * as React from 'react';
import { range } from '../../helpers/range';
import classes from './Table.module.css';
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { TableColumn as TableColumnProps } from './TableProps';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import Tag from '../Tag';
import useSort from './useSort';


function Table({
  columnsInfo,
  rows,
  size,
  currentPage,
  setColumnsInfo,
  handleRowChange,
  initialRow,
  rowIdName,
  onRowClick
}) {

  const [handleSortRows] = useSort({
    rows,
    columnsInfo,
    setColumnsInfo,
    handleRowChange,
    initialRow
  })

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
          rowIdName={rowIdName}
          onRowClick={onRowClick}
        />
      </tbody>
    </table>
  )
}

function TableHeader({ headerInfo, sortRows }: { headerInfo: TableColumnProps, sortRows: (string) => void }) {
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

function TableRow({ currentPage, size, rows, columns, rowIdName, onRowClick }) {
  const start = currentPage * size;
  const end = size * (currentPage + 1);

  return (
    <React.Fragment>
      {range(start, end).map((rowIndex) => {
        const row = rows[rowIndex];
        return rowIndex < rows.length && (
          <tr
            className={row.selected ? classes.rowSelected : ``}
            key={row[rowIdName]}
            onClick={() => onRowClick(row)}>

            <TableColumns rows={rows} rowIndex={rowIndex} columns={columns} />
          </tr>
        )
      })}
    </React.Fragment>
  )

}

function TableColumns({ columns, rowIndex, rows }: {
  columns: TableColumnProps[], rowIndex: number, rows: Array<any>
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
  row: any, columnInfo: TableColumnProps
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