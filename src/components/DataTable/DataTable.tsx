import * as React from 'react';
import Pagination from './Pagination';
import classes from './Table.module.css';
import { Columns, ChevronDown, Check } from 'lucide-react';
import TableFilter from './TableFilter';
import Table from './Table';
import Grid from './Grid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TableColumn } from './TableProps';
import useFilter from './useFilter';


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
      <div className='flex flex-row gap-5 my-8'>
        <TableFilter className="grow" onChange={handleFilter} columns={columns} />

        <div className='flex flex-col self-end'>
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

      <div className='flex flex-row items-center justify-between mt-10 mb-10'>
        <div className='flex flex-row gap-5 items-center'>
          <PageSizeSelection
            size={size}
            setSize={setSize}
            totalRows={rows.length}
          />
          <p className='label mb-0'>
            Showing <span className='font-black'>{currentPage * size} - {(currentPage + 1) * size}</span> {' '}
            of {' '}
            <span className='font-black'>{rows.length}</span> items
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChange={handleChangePage}

        />
      </div>
    </React.Fragment>);
}

function PageSizeSelection({ size, setSize, totalRows }) {
  const id = React.useId();
  const selectId = `${id}-rowsPerPage`;

  return (
    <div className='flex flex-row gap-3 items-center'>
      <label htmlFor={selectId} className='label'>Rows per page</label>
      <select
        className={classes.pageSize}
        value={size}
        id={selectId}
        placeholder="Select"
        onChange={event => {
          setSize(Number(event.target.value));
        }} >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value={totalRows}>{totalRows}</option>
      </select>
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


  return <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button className={classes.dropdownBtn} aria-label="Customise options">
        <Columns size={15} />
        Toggle columns
        <ChevronDown size={15} />
      </button>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={classes.dropdownMenuContent} sideOffset={5}>
        {
          columns.map(({ key, headerLabel, visible }) => key && (
            <DropdownMenu.CheckboxItem
              key={key}
              className={`${classes.dropdownCheckItem} ${visible ? classes.dropdownCheckItemActive : ''}`}
              checked={visible}
              onCheckedChange={(checked) => handleToogleColumns(checked, key)}>
              <DropdownMenu.ItemIndicator>
                <Check size={15} />
              </DropdownMenu.ItemIndicator>
              {headerLabel}
            </DropdownMenu.CheckboxItem>
          ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
}

export default DataTable;
