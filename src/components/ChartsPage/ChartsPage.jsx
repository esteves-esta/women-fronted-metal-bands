import React from 'react';
// import { ResponsiveLine } from '@nivo/line'

import BandCountByContryChart from './BandCountByContryChart'
import BandYearsActiveByCountryChart from './BandYearsActiveByCountryChart '
import BandCountByDecadeChart from './BandCountByDecadeChart'
import ByCountryBoolean from './ByCountryBooleanChart'
import BandDetailsChart from './BandDetailsChart'
import classes from './ChartsPage.module.css'

function ChartsPage() {
  return <div className="mx-10 my-10">

    <div className='text-center mt-10'>
      <hr />
      <h2 className='title1'>Data visualization</h2>
      <p className='title2 mt-10'>
        Bands count by country
      </p>
    </div>

    <div style={{ height: '350px' }}>
      <BandCountByContryChart />
    </div>

    <div className='text-center mt-10'>
      <hr />
      <p className='title2 mt-10'>
        Bands years active by country
      </p>
    </div>

    <div className='mt-9' style={{ height: '900px' }}>
      <BandYearsActiveByCountryChart />
    </div>

    <div className='text-center mt-10'>
      <hr />
      <p className='title2 mt-10'>
        Bands active in each decade by country
      </p>
    </div>

    <div style={{ height: '500px' }}>
      <BandCountByDecadeChart />
    </div>

    <div className='text-center mt-10'>
      <hr />
      <p className='title2 mt-10'>
        teste
      </p>
    </div>

    <div style={{ height: '500px' }}>
      <ByCountryBoolean />
    </div>


    <div className='text-center mt-10'>
      <hr />
      <p className='title2 mt-10'>
        teste 2
      </p>
    </div>

    <div style={{ height: '500px' }}>
      <BandDetailsChart />
    </div>

  </div>;
}


export default ChartsPage;
