import React from 'react';
// import { ResponsiveLine } from '@nivo/line'

import BandCountByContryChart from './BandCountByContryChart'
import BandYearsActiveByCountryChart from './BandYearsActiveByCountryChart '
import BandCountByDecadeChart from './BandCountByDecadeChart'
import ByCountryBoolean from './ByCountryBooleanChart'
import BandDetailsChart from './BandDetailsChart'
import classes from './ChartsPage.module.css'

function ChartsPage() {
  return <div className="mx-10 my-24">

    <div className='text-center '>
      <hr className='my-16' />
      <h2 className='title1'>Data visualization</h2>
      <p className='title2 mt-16'>
        Bands count by country
      </p>
    </div>

    <div style={{ height: '350px' }}>
      <BandCountByContryChart />
    </div>
    {/* ---------------------------------- */}
    <div className='text-center '>
      <hr className='my-16' />
      <p className='title2 '>
        How many these bands are active in each decade
      </p>
    </div>

    <div style={{ height: '500px' }}>
      <ByCountryBoolean />
    </div>
    {/* ---------------------------------- */}

    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        Other demographics
      </p>
    </div>

    <div>
      <BandDetailsChart />
    </div>

    <div className='text-center'>
      <hr className='my-16' />
      <p className='title2'>
        How long these bands are active - by country
      </p>
    </div>

    <div className='mt-9' style={{ height: '800px' }}>
      <BandYearsActiveByCountryChart />
    </div>

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
