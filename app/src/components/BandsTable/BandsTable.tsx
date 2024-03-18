import * as React from 'react';
import { Filter, ExternalLink, PlayCircle, Table2, Grid, Download } from 'lucide-react';
import { booleanTagList, filterByDetailsOptions, growFilterOptions, growTagList } from '../../constants';
import { TableColumn } from '../DataTable/TableProps';
import DataTable from '../DataTable'
import { BandContext } from '../BandsProvider';
import { DeezerContext } from '../DeezerProvider';
import ToogleGroupButton from '../ToogleGroupButton';
import { TagInfo } from '../Tag';

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { sample } from '../../helpers/range';
import classes from './BandsTable.module.css'
import useMatchMedia from '../../helpers/useMatchMedia';
import Pagination from '../DataTable/Pagination';
import Dropdown from '../Drowdown'

function BandsTable() {
  const { bands, total, isLoading, totalFiltered, handleFilter, handleSort, downloadAll, downloadFiltered, handleQuery, searchParams } = React.useContext(BandContext)
  const { getTrackPreview } = React.useContext(DeezerContext)

  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
  const [bandDetailsFilter, setBandDetailsFilter] = React.useState('viewAll')
  const [displayMode, setIsDisplayMode] = React.useState('table')

  const handleGrowlFilter = React.useCallback((val) => {
    if (val) {
      setGrowlFilter(val)
      handleFilter(val, bandDetailsFilter)
      setCurrentPage(0)
    }
  }, [bandDetailsFilter]);

  const handleDetailFilter = React.useCallback((val) => {
    if (val) {
      setBandDetailsFilter(val)
      handleFilter(growlFilter, val)
      setCurrentPage(0)
    }
  }, [growlFilter]);

  // ------------

  const displayOptions = [
    { value: 'table', text: 'Table', icon: Table2, iconOnly: true },
    { value: 'grid', text: 'Grid', icon: Grid, iconOnly: true }
  ]

  const statusTagList: TagInfo[] = [
    { value: true, text: "Active", type: "info" },
    { value: false, text: "Disbanded", type: "dark" }
  ];

  const playRecommendedTrackOrOpenLink = (row) => {
    if (row.deezerId || row.deezerRecommendationId) {
      getTrackPreview(row.deezerId);
      return;
    }
    if (row.links) {
      setTimeout(() => window.open(
        row.links,
        '_blank'
      ), 10);
    }

  }

  const playRandom = () => {
    const randomBand = sample(bands.filter(item => item.deezerId != null || item.deezerRecommendationId != null));
    getTrackPreview(randomBand.deezerId);
  }

  const formatGridImage = (row) => {
    if (!row) {
      // console.log({ row })
      return { src: null, alt: null }
    }
    if (row.deezerPicture && !row.emptyPicture)
      return {
        src: row.deezerPicture,
        alt: "Picture of the band"
      }
    if (row.deezerTrackInfo && row.emptyPicture)
      return {
        src: row.deezerTrackInfo.album.cover_medium,
        alt: `Cover of album: ${row.deezerTrackInfo.albumtitle}`
      }
    return { src: null, alt: null }
  }

  // ------------
  const formatPlayOrLink = (column) => {
    if (!column) return;
    if (column.deezerId || column.deezerRecommendationId) {
      return (<span className='flex justify-center'>
        <PlayCircle />
        <VisuallyHidden.Root>This band has a preview that can be played clicking on the row.</VisuallyHidden.Root>
      </span>
      )
    }
    if (column.links && !column.deezerId && !column.deezerRecommendationId) {
      return (
        <a className='flex justify-center' href={column.links} target="_blank" onClick={(event) => event.stopPropagation()}>
          <ExternalLink />
          <VisuallyHidden.Root>Link for an official page or a track from the band.</VisuallyHidden.Root>
        </a>
      )
    }
    return <React.Fragment></React.Fragment>
  }

  const columns = React.useMemo(() => {
    const cols: TableColumn[] = [
      { visible: true, formatElement: formatPlayOrLink, headerLabel: 'Play/Link' },
      { filter: true, visible: true, field: 'band', headerLabel: 'Band', sortable: true },
      {
        filter: false, visible: true, field: 'growling', headerLabel: 'Growling', sortable: true,
        tagList: growTagList, tag: true, sort: 'desc', sortWithRawValue: true,
      },
      {
        filter: false, visible: true, field: 'yearEnded', headerLabel: 'Status', sortable: true,
        format: (cols) => !cols.yearEnded, tag: true, tagList: statusTagList
      },
      {
        filter: false, visible: false, field: 'blackWomen', headerLabel: 'Black Women', sortable: true,
        tagList: booleanTagList, tag: true
      },
      {
        filter: false, visible: true, field: 'allWomenBand', headerLabel: 'All women', sortable: true,
        tagList: booleanTagList, tag: true
      },
      {
        filter: false, visible: false, field: 'sister', headerLabel: 'Sisters', sortable: true,
        tagList: booleanTagList, tag: true
      },
      { filter: true, visible: false, field: 'numberOfVocalists', headerLabel: 'Nº Voc.', sortable: true },
      { filter: true, visible: true, field: 'currentVocalists', headerLabel: 'Vocalists', },
      { filter: true, visible: true, field: 'country', headerLabel: 'Country', sortable: true },
      { filter: true, visible: true, field: 'activeFor', headerLabel: 'Active for', sortable: true },
      { filter: true, visible: true, field: 'yearStarted', headerLabel: 'Start', sortable: true },
      { filter: true, visible: false, field: 'yearEnded', headerLabel: 'End', sortable: true },
    ];
    return cols.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  }, [])

  const mediaNarrow = useMatchMedia(900)
  React.useEffect(() => {
    if (mediaNarrow) setIsDisplayMode('grid')
  }, [mediaNarrow])

  const [currentPage, setCurrentPage] = React.useState(0);
  const [size, setSize] = React.useState(10);
  const [lastPage, setLastPage] = React.useState(() => Math.ceil(bands.length / 10));

  React.useEffect(() => {
    setLastPage(Math.ceil(totalFiltered / size))
  }, [size, totalFiltered])


  const handleChangePage = (value: number | string) => {
    if (value) setCurrentPage(Number(value))
  };


  const handleSearchFilter = (searchValue: string, col: string) => {
    handleQuery(searchValue, col)
    setCurrentPage(0);

  };

  return (
    <section>
      <div className='gap-4 flex-col flex md:gap-8 items-center'>
        <h2 className="title1">
          The List
        </h2>

        <div className='flex flex-col gap-2 text-center'>
          <p className='title2'>
            {total} bands
          </p>
          {total !== totalFiltered && (
            <small className='title2'>
              (filtered: {totalFiltered} bands)
            </small>
          )}
        </div>

        <div className='flex flex-col lg:flex-row items-center gap-3'>
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
        isLoading={isLoading}
        rows={bands}
        total={totalFiltered}
        columns={columns}
        currentPage={currentPage}
        pageSize={size}
        gridMode={displayMode === 'grid'}
        rowIdName="id"
        onRowClick={playRecommendedTrackOrOpenLink}
        onFilter={handleSearchFilter}
        gridImage={formatGridImage}
        sortParams={searchParams}
        onSortRow={handleSort}
      >
        <div className={classes.row}>
          <div className={`${classes.innerRow}`}>
            <span className='flex gap-3 label'>
              <Filter size={20} />
              Growling intensity</span>
            <ToogleGroupButton
              list={growFilterOptions}
              currentValue={growlFilter}
              onChange={handleGrowlFilter} />
          </div>

          {!mediaNarrow && <div className={`${classes.innerRow}`}>
            <span className='flex gap-3 label'>    <Filter size={20} />Display mode</span>
            <ToogleGroupButton
              list={displayOptions}
              currentValue={displayMode}
              onChange={(val) => val && setIsDisplayMode(val)} />
          </div>}

          <div className={`${classes.innerRow}`}>
            <label className='label flex gap-3'><Filter size={20} />Filter</label>
            <ToogleGroupButton
              list={filterByDetailsOptions}
              currentValue={bandDetailsFilter}
              onChange={handleDetailFilter} />
          </div>
        </div>

        {!isLoading && <div className='flex flex-col lg:flex-row text-center md:text-left md:justify-between items-center mb-6 gap-3'>
          <p className='label m-0'>Click on a row to play a preview or to open the band's website.</p>
          <button className='button' onClick={playRandom}>
            <PlayCircle size={20} />
            Or play a random track
          </button>

        </div>}
      </DataTable>


      {!isLoading && <div className='flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between mt-10 mb-10'>
        <div className='flex flex-col lg:flex-row gap-5 md:items-center'>
          <PageSizeSelection
            size={size}
            setSize={setSize}
            totalRows={totalFiltered}
          />

        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <p className='label md:mb-0'>
            Showing <span className='font-black'>{currentPage * size} - {(currentPage + 1) * size}</span> {' '}
            of {' '}
            <span className='font-black'>{totalFiltered}</span> items
          </p>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={handleChangePage}
          />
        </div>
      </div>}


    </section >)
}

export default BandsTable;


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
