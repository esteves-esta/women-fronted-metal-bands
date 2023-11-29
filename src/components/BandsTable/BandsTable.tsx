import * as React from 'react';
import DataTable, { TableColumn } from '../DataTable'
import { BandContext } from '../BandsProvider';
import { booleanTagList, growTagList } from '../../constants';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { Filter, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';
import Tag, { TagInfo } from '../Tag';

function BandsTable() {
  const { bands, initialBandList, setBands } = React.useContext(BandContext)

  const growFilterOptions = React.useMemo(() => [...growTagList, {
    value: 'viewAll', text: 'View All'
  }], [])

  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
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

  const columns: TableColumn[] = React.useMemo(() => [
    { field: 'Band', formatElement: formatBandNameLinks, headerLabel: 'Band', sortable: true },
    { field: 'Growling', headerLabel: 'Growling', sortable: true, formatElement: (cols) => formatTag(cols, 'Growling', growTagList), sort: 'desc' },
    // { field: 'LGBTQ', headerLabel: 'LGBTQ', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'LGBTQ', booleanTagList) },
    { field: 'Black Women', headerLabel: 'Black Women', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'Black Women', booleanTagList) },
    { field: 'All women band', headerLabel: 'All women', sortable: true, handleSort: handleSortBoolean, formatElement: (cols) => formatTag(cols, 'All women band', booleanTagList) },
    { field: 'Vocalists', headerLabel: 'Vocalists', },
    { field: 'Country', headerLabel: 'Country', sortable: true },
    { format: formatYearsActive, headerLabel: 'Years', sortable: true },
    { format: formatActiveYears, headerLabel: 'Active for', },
  ], [])

  const handleGrowlFilter = React.useCallback((val) => {
    if (growFilterOptions.find(filter => filter.value.toString() === val)) {
      setGrowlFilter(val)
      filterByGrow(val)
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

  return < section >
    <div className='flex flex-row gap-4 items-center'>

      <h1 className="title1">
        The List
      </h1>

      <div className='flex flex-col'>
        <h2 className='title2'>
          {initialBandList.length} bands
        </h2>
        {initialBandList.length !== bands.length && (<small className='title2'>
          (filtered: {bands.length} bands)
        </small>)}
      </div>
    </div>

    <DataTable isFiltered={growlFilter !== 'viewAll'} rows={bands} columns={columns} pageSize={10} handleRowChange={setBands}>
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
          <button onClick={downloadAll}>Download list</button>
          <button onClick={downloadFiltered}>Dowload filtered result</button>
        </div>
      </div>

    </DataTable>
  </section>;
}

export default BandsTable;

