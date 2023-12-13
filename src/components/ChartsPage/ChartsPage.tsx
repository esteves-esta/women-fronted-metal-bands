import React from 'react';
import { filterByDetailsOptions, growFilterOptions } from '../../constants';
import BandCountByContryChart from './BandCountByContryChart'
import BandYearsActiveByCountryChart from './YearsActiveByCountryChart '
import BandCountByDecadeChart from './BandCountByDecadeChart'
import ActivityInEachDecadeChart from './YearsActiveInEachDecadeChart'
import BandYearsActiveChart from './YearsActiveChart'
import BandDetailsChart from './BandDetailsChart'
import ToogleGroupButton from '../ToogleGroupButton';
import useMatchMedia from '../../helpers/useMatchMedia';

function ChartsPage() {
  const [bandStatusFilter, setBandStatusFilter] = React.useState('viewAll')
  const [bandStatus2Filter, setBandStatus2Filter] = React.useState('viewAll')
  const [growlFilter, setGrowlFilter] = React.useState('viewAll')

  const isMediaNarrow = useMatchMedia();

  return <div className="mx-10 my-24">

    <div>
      <hr className='text-center my-16' />
      <h2 className='text-center title1'>Data visualization</h2>
      <p className='text-center title2 mt-16'>
        Bands count by country
      </p>

      <div className='flex flex-col md:flex-row md:justify-center my-5 gap-3 md:items-center'>
        <label className='label'>Filter</label>
        <ToogleGroupButton list={filterByDetailsOptions} currentValue={bandStatusFilter}
          onChange={(val) =>
            setBandStatusFilter(val)
          } />
      </div>

      <hr className='mx-16' />
      <div className='flex flex-col md:flex-row md:justify-center my-5 gap-3 md:items-center'>
        <label className='label'>Growling intensity</label>
        <ToogleGroupButton list={growFilterOptions} currentValue={growlFilter}
          onChange={(val) =>
            setGrowlFilter(val)
          } />
      </div>
    </div>

    <div style={{ height: isMediaNarrow ? '900px' : '450px' }}>
      <BandCountByContryChart filter={bandStatusFilter} filterGrow={growlFilter} />
    </div>
    {/* ---------------------------------- */}

    <div className='text-center '>
      <hr className='my-16' />
      <p className='title2 '>
        How many these bands are active in each decade
      </p>
    </div>

    <div style={{ height: '400px' }}>
      <ActivityInEachDecadeChart />
    </div>

    {/* ---------------- */}
    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        How long are these bands active
      </p>
    </div>

    <div style={{ height: '400px' }}>
      <BandYearsActiveChart />
    </div>

    {/* ---------------------------------- */}

    <div>
      <hr className='text-center my-16' />
      <p className='text-center title2'>
        Other demographics
      </p>

      <div className='flex flex-col md:flex-row  md:justify-center mt-5 gap-3  md:items-center'>
        <label className='label'>Filter</label>
        <ToogleGroupButton list={[
          { value: 'viewAll', text: 'View All' },
          { value: 'active', text: 'Active' },
          { value: 'disbanded', text: 'Disbanded' },
        ]} currentValue={bandStatus2Filter}
          onChange={(val) =>
            setBandStatus2Filter(val)
          } />
      </div>
    </div>

    <div>
      <BandDetailsChart filter={bandStatus2Filter} />
    </div>

    {/* ========================== */}

    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        How long these bands are active - by country
      </p>
    </div>

    <div className='mt-9' style={{ height: '800px' }}>
      <BandYearsActiveByCountryChart />
    </div>


    {/* ------------------------------ */}

    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        How many of these bands are active in each decade - by country
      </p>
    </div>

    <div style={{ height: '700px' }}>
      <BandCountByDecadeChart />
    </div>




  </div>;
}


export default ChartsPage;
