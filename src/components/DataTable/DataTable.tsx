import * as React from 'react';
import Pagination from './Pagination';
import { Columns } from 'lucide-react';
import TableFilter from './TableFilter';
import Table from './Table';
import Grid from './Grid';
import { TableColumn } from './TableProps';
import useFilter from './useFilter';
import Dropdown from '../Drowdown'
import classes from './Table.module.css'
interface Props {
  rows: Array<any>
  initialPage?: number
  pageSize: number
  columns: TableColumn[]
  handleRowChange: (val) => void
  isFiltered: boolean | null,
  gridMode: boolean | null,
  children?: any
  rowIdName: string
  onRowClick?: (row) => void
  gridImage?: (row) => { src: string | null, alt: string | null }
}

function DataTable({
  initialPage = 0,
  gridMode = false,
  rows,
  rowIdName,
  columns,
  pageSize,
  isFiltered,
  children,
  handleRowChange,
  onRowClick,
  gridImage
}: Props) {

  const [initialRow] = React.useState([...rows]);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(pageSize);
  const [lastPage, setLastPage] = React.useState(() => Math.ceil(rows.length / pageSize));

  const [columnsInfo, setColumnsInfo] = React.useState(() => {
    const newColumns = [...columns];
    return newColumns.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  });

  React.useEffect(() => {
    setLastPage(Math.ceil(rows.length / size))
  }, [size])

  React.useEffect(() => {
    const colSort = columnsInfo.findIndex(col => col.sort != undefined)
    if (colSort >= 0 && isFiltered) {
      const newCols = [...columnsInfo]
      newCols[colSort].sort = undefined
      setColumnsInfo(newCols)
    }

    setCurrentPage(0);
    setLastPage(Math.ceil(rows.length / size))
  }, [isFiltered])

  const handleChangePage = (value: number | string) => {
    if (value) setCurrentPage(Number(value))
  };


  const [handleFilter] = useFilter({
    columns,
    initialRow,
    handleRowChange,
    setCurrentPage,
    setLastPage,
    size,
    rows,
  })

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
          size={size}
          rows={rows}
          currentPage={currentPage}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
          // sort
          handleColumnChange={setColumnsInfo}
          handleRowChange={handleRowChange}
          initialRow={initialRow}
        />
      )}

      {gridMode && (
        <Grid
          gridImage={gridImage}

          columns={columnsInfo}
          size={size}
          rows={rows}
          currentPage={currentPage}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
          // sort
          handleColumnChange={setColumnsInfo}
          handleRowChange={handleRowChange}
          initialRow={initialRow}
        />
      )}

      <div className='flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between mt-10 mb-10'>
        <div className='flex flex-col lg:flex-row gap-5 md:items-center'>
          <PageSizeSelection
            size={size}
            setSize={setSize}
            totalRows={rows.length}
          />

        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <p className='label md:mb-0'>
            Showing <span className='font-black'>{currentPage * size} - {(currentPage + 1) * size}</span> {' '}
            of {' '}
            <span className='font-black'>{rows.length}</span> items
          </p>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </React.Fragment>);
}

function PageSizeSelection({ size, setSize, totalRows }) {
  const id = React.useId();
  const selectId = `${id}-rowsPerPage`;
  const options = [
    { size: 10 },
    { size: 20 },
    { size: 30 },
    { size: 40 },
    { size: 50 },
    { size: totalRows }
  ];

  return (
    <div className='flex flex-col lg:flex-row gap-3 lg:items-center'>
      <label htmlFor={selectId} className='label'>Rows per page</label>
      <Dropdown
        radioOptions={options}
        handleChange={(selected) => {
          setSize(selected)
        }}
        radioValue={size}
        labelName="size"
        keyName="size"
      >
        {size}
      </Dropdown>
    </div>
  )
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
