import * as React from 'react';
import Pagination from './Pagination';
import classes from './Table.module.css';
import { Columns, ChevronDown, Check, ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import TableFilter from './TableFilter';
import Table from './Table';
import Grid from './Grid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getValueFromRow } from './getValueFromRow';
import { TableColumn } from './TableProps';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import useSort from './useSort';

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
  rows,
  initialPage = 0,
  pageSize,
  columns,
  handleRowChange,
  isFiltered,
  children,
  gridMode = false,
  rowIdName,
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

  const [handleSortRows] = useSort({
    rows,
    columnsInfo,
    setColumnsInfo,
    handleRowChange,
    initialRow
  })

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

  const handleChangePage = React.useCallback((value: number | string) => {
    if (value) setCurrentPage(Number(value))
  }, []);

  const handleFilter = React.useCallback(
    (searchValue: string, colKey: string) => {
      let newRows;
      if (searchValue) newRows = filterRows(searchValue, colKey);
      else newRows = [...initialRow];
      // console.log({ newRows })

      handleRowChange(newRows);
      setCurrentPage(0);
      setLastPage(Math.ceil(newRows.length / size))
    }, [])

  const filterRows = React.useCallback((searchValue: string, colKey: string) => {
    let newRows = [...rows];
    return newRows.filter(
      row => {
        if (colKey !== 'all') {
          const col = columns.find(col => col.key === colKey)
          if (col) {
            let colValue = getValueFromRow(col, row)
            if (typeof colValue === 'number')
              return colValue == Number(searchValue)
            else
              return colValue.includes(searchValue.toLowerCase())
          }
        }
        const columnsVisible = Object.entries(row).filter(item => columns.find(col => col.field === item[0]))
        const formattedColumns = columns.filter(col => !!col.format);
        const formattedRow = formattedColumns.map(col => col.format && col.format(row))
        const valuesNotBoolean = columnsVisible.filter(item => typeof item[1] !== 'boolean').map(item => item[1])
        return valuesNotBoolean.concat(formattedRow).join(' ').toLowerCase().includes(searchValue.toLowerCase())
      }
    )

  }, []);

  const handleToogleColumns = React.useCallback((checked: boolean, key: string) => {
    const newCols = [...columnsInfo]
    const toggled = newCols.find(col => col.key === key)
    if (toggled) toggled.visible = checked;
    setColumnsInfo([...newCols])
  }, [columnsInfo]);

  return (
    <React.Fragment>
      <div className='flex flex-row gap-5 my-8'>

        <TableFilter className="grow" onChange={handleFilter} columns={columns} />

        <div className='flex flex-col self-end'>
          <DropdownMenu.Root>
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
                  columnsInfo.map(({ key, headerLabel, visible }) => key && (
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
        </div>
      </div>

      {children}

      {!gridMode && (
        <Table
          columnsInfo={columnsInfo}
          size={size}
          rows={rows}
          currentPage={currentPage}
          handleRowChange={handleRowChange}
          setColumnsInfo={setColumnsInfo}
          initialRow={initialRow}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
        />
      )}

      {gridMode && (
        <div className='flex flex-row gap-10 my-10 items-center'>
          <p className='label mb-0'>Sorting</p>
          {columnsInfo.map((headerInfo, index) => {
            const { sortable, headerLabel, sort, visible } = headerInfo

            return sortable && visible && (
              <button
                key={headerInfo.key}
                className={classes.gridSortBtn}
                onClick={() => handleSortRows(headerInfo, index)}
              >

                {headerLabel}

                {!sort && <ArrowUpDown size={15} />}
                {sort === 'asc' && <ArrowUpAZ size={15} />}
                {sort === 'desc' && <ArrowDownAZ size={15} />}
                <VisuallyHidden.Root>
                  Toggle sorting{' '}
                  {sort || 'off'}
                </VisuallyHidden.Root>
              </button>)
          }
          )}
        </div>

      )}

      {gridMode && (
        <Grid
          columns={columnsInfo}
          size={size}
          rows={rows}
          currentPage={currentPage}
          rowIdName={rowIdName}
          onRowClick={onRowClick}
          gridImage={gridImage}
        />
      )}

      <div className='flex flex-row items-center justify-between mt-10 mb-10'>
        <div className='flex flex-row gap-5 items-center'>
          <div className='flex flex-row gap-3 items-center'>
            <label htmlFor="rowsPerPage" className='label'>Rows per page</label>
            <select className={classes.pageSize} value={size} onChange={event => {
              setSize(Number(event.target.value));
            }} id='rowsPerPage' placeholder="Select">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
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




export default DataTable;
