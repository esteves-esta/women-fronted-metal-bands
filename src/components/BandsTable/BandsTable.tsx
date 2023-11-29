import * as React from 'react';
import DataTable, { getColumnDataFromRow, TableColumn } from '../DataTable'
import { BandContext } from '../BandsProvider';
import { booleanTagList, growTagList } from '../../constants';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { Filter, ExternalLink, Table2, Grid, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import Tag, { TagInfo } from '../Tag';
import BandFilter from './BandFilter';

function BandsTable() {
  const { bands, initialBandList, setBands } = React.useContext(BandContext)

  const growFilterOptions = React.useMemo(() => [...growTagList, {
    value: 'viewAll', text: 'View All', icon: Table2
  }], [])

  const displayOptions = React.useMemo(() => [
    { value: 'table', text: 'Table', icon: Table2, iconOnly: true },
    { value: 'grid', text: 'Grid', icon: Grid, iconOnly: true }
  ], [])

  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
  const [isFilteredData, setFilteredData] = React.useState<string | null>(null)
  const [displayMode, setIsDisplayMode] = React.useState('table')
  const { filterByGrow } = React.useContext(BandContext)

  const handleSortBoolean = React.useCallback((valA, valB, sort: 'asc' | 'desc') => {
    if (sort === 'asc') return (valA === valB) ? 0 : valA ? -1 : 1;
    else return (valA === valB) ? 0 : valA ? 1 : -1;
  }, [])

  const formatYearsActive = React.useCallback((column: any) => {
    const { YearStarted, YearEnded } = column;

    const thisYear = new Date().getFullYear()

    let activeYears = 0
    if (YearStarted !== null) {
      activeYears = thisYear - YearStarted
      if (YearEnded) activeYears = YearEnded - YearStarted
    }

    return activeYears.toString();
  }, []);

  const formatTag = React.useCallback((column: any, field: string, tagList: TagInfo[]) => {
    return (
      <Tag value={column[field]} tagInfo={tagList} />
    )
  }, [])

  const formatBandNameLinks = React.useCallback((column) => {
    if (!column.Links) return column.Band;
    return (
      <React.Fragment>
        <span className='flex items-center justify-center gap-3'>
          {column.Band}
          <a href={column.Links} target="_blank">
            <ExternalLink size={12} />
          </a>

        </span>
      </React.Fragment>)
  }, [])

  const formatActiveYears = React.useCallback((column) => {
    const end = column.YearEnded ? column.YearEnded : 'now'
    return `${column.YearStarted} - ${end}`
  }, [])

  const columns = React.useMemo(() => {
    const cols: TableColumn[] = [
      { field: 'Band', formatElement: formatBandNameLinks, headerLabel: 'Band', sortable: true },
      { field: 'Growling', headerLabel: 'Growling', sortable: true, formatElement: (cols) => formatTag(cols, 'Growling', growTagList), sort: 'desc' },
      // { field: 'LGBTQ', headerLabel: 'LGBTQ', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'LGBTQ', booleanTagList) },
      { field: 'Black Women', headerLabel: 'Black Women', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'Black Women', booleanTagList) },
      { field: 'All women band', headerLabel: 'All women', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'All women band', booleanTagList) },
      { field: 'Vocalists', headerLabel: 'Vocalists', },
      { field: 'Country', headerLabel: 'Country', sortable: true },
      { format: formatYearsActive, headerLabel: 'Years', sortable: true },
      { format: formatActiveYears, headerLabel: 'Active for', },
    ];
    return cols.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  }, [])

  const handleGrowlFilter = React.useCallback((val) => {
    if (growFilterOptions.find(filter => filter.value.toString() === val)) {
      setGrowlFilter(val)
      filterByGrow(val)
      console.log({ val })
      setFilteredData(val !== 'viewAll' ? val : null)
    }
  }, []);

  function downloadAll() {
    const content = Papa.unparse(initialBandList, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-frontend-metal-bands.csv')
  }

  function downloadFiltered() {
    const content = Papa.unparse(bands, {
      quotes: false,
      delimiter: ",",
      header: true,
      newline: "\r\n",
      skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null //or array of strings
    }
    );

    downloadCsvFile(content, 'women-frontend-metal-bands filtered-list.csv')
  }

  const handleFilter = React.useCallback((searchValue: string, colKey: string) => {
    let newRows = [...bands];
    if (searchValue) {

      const filtered = newRows.filter(
        row => {
          if (colKey !== 'all') {
            const col = columns.find(col => col.key === colKey)
            if (col) {

              let colValue = getColumnDataFromRow(col, row)
              if (colValue !== NaN)
                return colValue == Number(searchValue)
              else
                return colValue.includes(searchValue.toLowerCase())
            }
          }
          const valuesNotBoolean = Object.values(row).filter(item => typeof item !== 'boolean')
          return valuesNotBoolean.join(' ').toLowerCase().includes(searchValue.toLowerCase())
        }
      )

      newRows = [...filtered]
      setFilteredData(searchValue)
    } else {
      setFilteredData(null)
      newRows = [...initialBandList];
    }
    setBands(newRows);

  }, [])

  return < section >
    <div className='flex flex-row gap-4 items-center'>

      <h1 className="title1">
        The List
      </h1>

      <div className='flex flex-col grow'>
        <h2 className='title2'>
          {initialBandList.length} bands
        </h2>
        {initialBandList.length !== bands.length && (<small className='title2'>
          (filtered: {bands.length} bands)
        </small>)}
      </div>

      <div>
        <ToogleGroupButton list={displayOptions} currentValue={displayMode}
          onChange={setIsDisplayMode} />
      </div>
    </div>

    <BandFilter onChange={handleFilter} columns={columns} />

    <div className='flex flex-row items-center mb-16 justify-between'>
      <div className='flex flex-row items-center '>
        <Filter size={17} />
        <span className='mr-3'>

          Growling intensity
        </span>
        <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
          onChange={handleGrowlFilter} />
      </div>
      <div className='flex flex-row items-center gap-2'>
        <button onClick={downloadAll} className="flex gap-2">
          <FileSpreadsheet />
          Download list
        </button>
        <button onClick={downloadFiltered} className="flex gap-2">
          <FileSpreadsheet /> Dowload filtered result
        </button>
      </div>
    </div>

    {displayMode === 'table' &&
      <DataTable
        isFiltered={isFilteredData}
        rows={bands}
        columns={columns}
        pageSize={10}
        handleRowChange={setBands}
      />
    }
  </section >;
}

export default BandsTable;

