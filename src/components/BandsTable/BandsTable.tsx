import * as React from 'react';
import { Filter, ExternalLink, PlayCircle, Table2, Grid, Download } from 'lucide-react';
import { booleanTagList, filterByDetailsOptions, growFilterOptions, growTagList } from '../../constants';
import { TableColumn } from '../DataTable/TableProps';
import DataTable from '../DataTable'
import { BandContext } from '../BandsProvider';
import { DeezerContext } from '../DeezerProvider';
import ToogleGroupButton from '../ToogleGroupButton';
import { TagInfo } from '../Tag';
import formatYearsActive from '../../helpers/formatYearsActive';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { sample } from '../../helpers/range';

function BandsTable() {
  const { bands, initialBandList, setBands, filter, downloadAll,
    downloadFiltered } = React.useContext(BandContext)
  const { getTrackPreview } = React.useContext(DeezerContext)

  const [growlFilter, setGrowlFilter] = React.useState('viewAll')
  const [bandDetailsFilter, setBandDetailsFilter] = React.useState('viewAll')
  const [displayMode, setIsDisplayMode] = React.useState('table')

  const handleGrowlFilter = React.useCallback((val) => {
    if (val) {
      setGrowlFilter(val)
      filter(val, bandDetailsFilter)
    }
  }, [bandDetailsFilter]);

  const handleDetailFilter = React.useCallback((val) => {
    if (val) {
      setBandDetailsFilter(val)
      filter(growlFilter, val)
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
    const randomBand = sample(bands);
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

  const formatActiveYears = (column) => {
    if (!column) return '';
    const end = column.yearEnded ? column.yearEnded : 'now'
    return `${column.yearStarted} - ${end}`
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
        filter: false, visible: true, headerLabel: 'Status', sortable: true,
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
      { filter: true, visible: false, field: 'currentVocalists', headerLabel: 'Nº Voc.', sortable: true, format: (col) => col.currentVocalists.length },
      { filter: true, visible: true, field: 'currentVocalists', headerLabel: 'Vocalists', },
      // { filter: true, visible: false, field: 'pastVocalists', headerLabel: 'Past Vo.', },
      { filter: true, visible: true, field: 'country', headerLabel: 'Country', sortable: true },
      { filter: true, visible: true, format: formatYearsActive, headerLabel: 'Active for', sortable: true },
      { filter: true, visible: false, format: formatActiveYears, headerLabel: 'Years Active', sortable: true },
    ];
    return cols.map(col => {
      if (col.key == undefined) col.key = crypto.randomUUID();
      return col;
    })
  }, [])


  return (
    <section>
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
        isFiltered={growlFilter !== 'viewAll' || bandDetailsFilter !== 'viewAll'}
        rows={bands}
        columns={columns}
        pageSize={10}
        handleRowChange={setBands}
        gridMode={displayMode === 'grid'}
        rowIdName="id"
        onRowClick={playRecommendedTrackOrOpenLink}
        gridImage={formatGridImage}
      >
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-3'>
            <Filter size={20} />
            <span className='label'>Growling intensity</span>
            <ToogleGroupButton
              list={growFilterOptions}
              currentValue={growlFilter}
              onChange={handleGrowlFilter} />
          </div>

          <div className='flex flex-row items-center gap-3'>
            <span className='label'>Display mode</span>
            <ToogleGroupButton
              list={displayOptions}
              currentValue={displayMode}
              onChange={(val) => val && setIsDisplayMode(val)} />
          </div>

        </div>

        <div className='flex flex-row items-center mb-16 justify-between'>
          <div className='flex justify-center my-5 gap-3 items-center'>
            <Filter size={20} />
            <label className='label'>Filter</label>
            <ToogleGroupButton
              list={filterByDetailsOptions}
              currentValue={bandDetailsFilter}
              onChange={handleDetailFilter} />
          </div>
        </div>


        <div className='flex justify-between items-center mb-6'>
          <p className='label m-0'>Click on row to play a preview of a track or to open the band website on other tab.</p>
          <button className='button' onClick={playRandom}>
            <PlayCircle size={20} />
            Or play a random track
          </button>

        </div>
      </DataTable>
    </section>)
}

export default BandsTable;

