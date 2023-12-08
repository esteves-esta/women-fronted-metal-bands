import React from 'react';
// import { ResponsiveLine } from '@nivo/line'

import BandCountByContryChart from './BandCountByContryChart'
import BandYearsActiveByCountryChart from './BandYearsActiveByCountryChart '
import BandCountByDecadeChart from './BandCountByDecadeChart'
import ActivityInEachDecadeChart from './ActivityInEachDecadeChart'
import BandYearsActiveChart from './BandYearsActiveChart'
import BandDetailsChart from './BandDetailsChart'
import classes from './ChartsPage.module.css'
import ToogleGroupButton from '../ToogleGroupButton';

function ChartsPage() {
  const [bandStatusFilter, setBandStatusFilter] = React.useState('viewAll')
  const [bandStatus2Filter, setBandStatus2Filter] = React.useState('viewAll')

  return <div className="mx-10 my-24">

    <div className='text-center '>
      <hr className='my-16' />
      <h2 className='title1'>Data visualization</h2>
      <p className='title2 mt-16'>
        Bands count by country
      </p>

      <div className='flex justify-center mt-5 gap-3 items-center'>
        <label htmlFor="filterCountByCountry" className='label'>Filter</label>
        <ToogleGroupButton id="filterCountByCountry" list={[
          { value: 'viewAll', text: 'View All' },
          { value: 'active', text: 'Active' },
          { value: 'disbanded', text: 'Disbanded' },
        ]} currentValue={bandStatusFilter}
          onChange={(val) =>
            setBandStatusFilter(val)
          } />
      </div>
    </div>

    <div style={{ height: '350px' }}>
      <BandCountByContryChart filter={bandStatusFilter} />
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

    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        Other demographics
      </p>

      <div className='flex justify-center mt-5 gap-3 items-center'>
        <label htmlFor="filterDemographics" className='label'>Filter</label>
        <ToogleGroupButton id="filterDemographics" list={[
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
