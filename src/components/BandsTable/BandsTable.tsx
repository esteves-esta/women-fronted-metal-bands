import * as React from 'react';
import DataTable from '../DataTable'
import { BandContext } from '../BandsProvider';
import { booleanTagList, growTagList } from '../../constants';
import { downloadCsvFile } from '../../helpers/downloadCsvFile'
import ToogleGroupButton from '../ToogleGroupButton/ToogleGroupButton';
import { Filter, ExternalLink, Table2, Grid, Download } from 'lucide-react';
import Papa from 'papaparse';
import { TagInfo } from '../Tag';
import { TableColumn } from '../DataTable/TableProps';

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
    const { yearStarted, YearEnded: yearEnded } = column;

    const thisYear = new Date().getFullYear()

    let activeYears = 0
    if (yearStarted !== null) {
      activeYears = thisYear - yearStarted
      if (yearEnded) activeYears = yearEnded - yearStarted
    }
    return activeYears.toString();
  }, []);

  const formatBandNameLinks = React.useCallback((column) => {
    if (!column) return;
    if (!column.links) return column.band;
    return (
      <span className='flex items-center gap-3'>
        {column.band}
        <a href={column.links} target="_blank">
          <ExternalLink size={12} />
        </a>

      </span>
    )
  }, [])

  const statusTagList: TagInfo[] = React.useMemo(() => [
    { value: true, text: "Active", type: "info" },
    { value: false, text: "Disbanded", type: "dark" }
  ], []);

  const formatActiveYears = React.useCallback((column) => {
    if (!column) return '';
    const end = column.yearEnded ? column.yearEnded : 'now'
    return `${column.yearStarted} - ${end}`
  }, [])

  const columns = React.useMemo(() => {
    const cols: TableColumn[] = [
      { filter: true, visible: true, field: 'band', formatElement: formatBandNameLinks, headerLabel: 'Band', sortable: true },
      {
        filter: false, visible: true, field: 'growling', headerLabel: 'Growling', sortable: true,
        tagList: growTagList, tag: true, sort: 'desc', sortWithRawValue: true,
      },
      {
        filter: false, visible: true, headerLabel: 'Status', handleSort: handleSortBoolean, sortable: true,
        format: (cols) => !cols.yearEnded, tag: true, tagList: statusTagList
      },
      {
        filter: false, visible: false, field: 'lgbtq', headerLabel: 'LGBTQ', sortable: true, handleSort: handleSortBoolean,
        tagList: booleanTagList, tag: true
      },
      {
        filter: false, visible: false, field: 'blackWomen', headerLabel: 'Black Women', sortable: true, handleSort: handleSortBoolean,
        tagList: booleanTagList, tag: true
      },
      {
        filter: false, visible: true, field: 'allWomenBand', headerLabel: 'All women', sortable: true, handleSort: handleSortBoolean,
        tagList: booleanTagList, tag: true
      },
      {
        filter: false, visible: false, field: 'sister', headerLabel: 'Sisters', sortable: true, handleSort: handleSortBoolean,
        tagList: booleanTagList, tag: true
      },
      { filter: true, visible: false, field: 'currentVocalists', headerLabel: 'Nº Voc.', sortable: true, format: (col) => col.currentVocalists.length },
      { filter: true, visible: true, field: 'currentVocalists', headerLabel: 'Vocalists', },
      { filter: true, visible: false, field: 'pastVocalists', headerLabel: 'Past Vo.', },
      { filter: true, visible: true, field: 'country', headerLabel: 'Country', sortable: true },
      { filter: true, visible: true, format: formatYearsActive, headerLabel: 'Active for', sortable: true },
      { filter: true, visible: false, format: formatActiveYears, headerLabel: 'Years Active', sortable: true },
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

      <div className='flex flex-row items-center gap-3'>
        <Download size={20} />
        <span className='label'>Download</span>
        <button className='button' onClick={downloadAll}>
          List
        </button>
        <button className='button' onClick={downloadFiltered} >
          Filtered list
        </button>
      </div>

    </div>

    <DataTable
      isFiltered={growlFilter !== 'viewAll'}
      rows={bands}
      columns={columns}
      pageSize={10}
      handleRowChange={setBands}
      gridMode={displayMode === 'grid'}
    >

      <div className='flex flex-row items-center mb-16 justify-between'>
        <div className='flex flex-row items-center gap-3'>
          <Filter size={20} />
          <span className='label'>Growling intensity</span>
          <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
            onChange={handleGrowlFilter} />
        </div>

        <div className='flex flex-row items-center gap-3'>
          <span className='label'>Display mode</span>
          <ToogleGroupButton list={displayOptions} currentValue={displayMode}
            onChange={setIsDisplayMode} />
        </div>

      </div>

    </DataTable>

  </section >;
}

export default BandsTable;

