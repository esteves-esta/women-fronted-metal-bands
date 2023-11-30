import * as React from 'react';
import DataTable, { TableColumn } from '../DataTable'
import { BandContext } from '../BandsProvider';
import { booleanTagList, growTagList } from '../../constants';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { Filter, ExternalLink, Table2, Grid, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import Tag, { TagInfo } from '../Tag';

function BandsTable() {
  const { bands, initialBandList, setBands, filterByGrow } = React.useContext(BandContext)
  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
  const [displayMode, setIsDisplayMode] = React.useState('table')

  const growFilterOptions = React.useMemo(() => [
    { value: 'viewAll', text: 'View All' },
    ...growTagList,
  ], [])

  const displayOptions = React.useMemo(() => [
    { value: 'table', text: 'Table', icon: Table2, iconOnly: true },
    { value: 'grid', text: 'Grid', icon: Grid, iconOnly: true }
  ], [])

  const handleSortBoolean = React.useCallback((valA, valB, sort: 'asc' | 'desc') => {
    if (sort === 'asc') return (valA === valB) ? 0 : valA ? -1 : 1;
    else return (valA === valB) ? 0 : valA ? 1 : -1;
  }, [])

  const formatYearsActive = React.useCallback((column: any) => {
    if (!column) return '';
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
    if (!column) return;
    return (
      <Tag value={column[field]} tagInfo={tagList} />
    )
  }, [])

  const formatBandNameLinks = React.useCallback((column) => {
    if (!column) return;
    if (!column.Links) return column.Band;
    return (
      <span className='flex items-center justify-center gap-3'>
        {column.Band}
        <a href={column.Links} target="_blank">
          <ExternalLink size={12} />
        </a>

      </span>
    )
  }, [])

  const formatActiveYears = React.useCallback((column) => {
    if (!column) return '';
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
      { field: 'CurrentVocalists', headerLabel: 'Vo. Num.', format: (col) => col.CurrentVocalists.length },
      { field: 'CurrentVocalists', headerLabel: 'Vocalists', },
      { field: 'PastVocalists', headerLabel: 'Past Vo.', },
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
    <div className='flex flex-col gap-8 items-center'>
      <h2 className="title1">
        The List
      </h2>

      <div className='flex flex-col gap-2 text-center'>
        <p className='title2'>
          {initialBandList.length} bands
        </p>
        {initialBandList.length !== bands.length && (
          <small className='title2'>
            (filtered: {bands.length} bands)
          </small>
        )}
      </div>

    </div>

    <DataTable
      isFiltered={growlFilter !== 'viewAll'}
      rows={bands}
      columns={columns}
      pageSize={displayMode === 'grid' ? 12 : 10}
      handleRowChange={setBands}
      gridMode={displayMode === 'grid'}
    >

      <div className='flex flex-row items-center mb-16'>
        <Filter size={17} />
        <span className='mr-3'>

          Growling intensity
        </span>
        <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
          onChange={handleGrowlFilter} />
      </div>

      <div className='flex flex-row items-center mb-8 justify-between'>
        <div className='flex flex-row items-center '>
          <span className='mr-3'>Display mode</span>
          <ToogleGroupButton list={displayOptions} currentValue={displayMode}
            onChange={setIsDisplayMode} />
        </div>

        <div className='flex flex-row items-center gap-4'>
          <button className='button' onClick={downloadAll}>
            <FileSpreadsheet />
            Download list
          </button>
          <button className='button' onClick={downloadFiltered} >
            <FileSpreadsheet /> Dowload filtered result
          </button>
        </div>
      </div>


    </DataTable>

  </section >;
}

export default BandsTable;

