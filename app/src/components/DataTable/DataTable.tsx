import * as React from 'react';

import { Columns } from 'lucide-react';
import TableFilter from './TableFilter';
import Table from './Table';
import Grid from './Grid';
import { TableColumn } from './TableProps';

import Dropdown from '../Drowdown'
import classes from './Table.module.css'
interface Props {
  rows: Array<any>
  currentPage: number
  total: number
  pageSize: number
  sortParams: { sort: string, sortBy: string }
  columns: TableColumn[]
  onSortRow: (sort, sortBy) => void
  gridMode: boolean | null,
  children?: any
  rowIdName: string
  onRowClick?: (row) => void
  onFilter?: (search, col) => void
  gridImage?: (row) => { src: string | null, alt: string | null }
}

function DataTable({
  gridMode = false,
  rows,
  rowIdName,
  columns,
  pageSize,
  children,
  currentPage,
  sortParams,
  onSortRow,
  onRowClick,
  onFilter,
  gridImage
}: Props) {



  const [columnsInfo, setColumnsInfo] = React.useState(() => {
    const newColumns = [...columns];
    return newColumns.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  });

  const handleFilter = React.useCallback(
    (searchValue: string, colKey: string) => {

      if (colKey === 'all') onFilter(searchValue, '');
      else {
        const col = columnsInfo.find(col => col.key === colKey)
        console.log(columnsInfo)
        if (col) {
          onFilter(searchValue, col.field);
        }
      }
    },
    []
  );


  return (
    <React.Fragment>
      <div className={classes.filterRow}>
        <TableFilter onChange={handleFilter} columns={columns} />

        <div className={classes.colToggle}>
          <TableColumnToogle columns={columnsInfo} onChange={setColumnsInfo} />
        </div>
      </div>

      {children}
      {!gridMode && (
        <Table
          columnsInfo={columnsInfo}
          size={pageSize}
          rows={rows}
          currentPage={currentPage}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
          sortParams={sortParams}
          handleSortRows={onSortRow}
        />
      )}

      {gridMode && (
        <Grid
          gridImage={gridImage}
          columns={columnsInfo}
          size={pageSize}
          rows={rows}
          currentPage={currentPage}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
          sortParams={sortParams}
          handleSortRows={onSortRow}
        />
      )}

    </React.Fragment>);
}


function TableColumnToogle({ columns, onChange }) {
  const handleToogleColumns = React.useCallback((checked: boolean, key: string) => {
    const newCols = [...columns]
    const toggled = newCols.find(col => col.key === key)
    if (toggled) toggled.visible = checked;
    onChange([...newCols])
  }, [columns]);


  return <Dropdown
    checkOptions={columns}
    handleChange={handleToogleColumns}
    checkName="visible"
    labelName="headerLabel"
    keyName="key"
  >
    <Columns size={15} />
    Toggle columns
  </Dropdown>
}

export default DataTable;
