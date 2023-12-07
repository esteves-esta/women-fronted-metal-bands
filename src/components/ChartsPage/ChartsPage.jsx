import React from 'react';
// import { ResponsiveLine } from '@nivo/line'

import BandCountByContryChart from './BandCountByContryChart'
import BandCountByDecadeChart from './BandCountByDecadeChart'
import classes from './ChartsPage.module.css'

/* 
pi

- active
- all women band
- black women
- sisters
*/


function ChartsPage() {
  return <div className="mx-10 my-10">
    <hr />

    <div className='text-center mt-10'>
      <h2 className='title1'>Data visualization</h2>
    </div>

    <div style={{ height: '350px' }}>
      <BandCountByContryChart />
    </div>
    <hr />

    <div style={{ height: '800px' }}>
      <BandCountByDecadeChart />
    </div>

    {/* <div style={{ height: '500px' }}>
      <MyResponsiveHeatMap data={chartHeatData} />
    </div> */}




    {/* <div style={{ height: '500px' }}>
      <MyResponsiveLine data={chartHeatData} />
    </div> */}

  </div>;
}



// const MyResponsiveLine = ({ data /* see data tab */ }) => (
//   <ResponsiveLine
//     data={data}
//     margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//     xScale={{ type: 'point' }}
//     yScale={{
//       type: 'linear',
//       min: 'auto',
//       max: 'auto',
//       stacked: true,
//       reverse: false
//     }}
//     yFormat=" >-.2f"
//     axisTop={null}
//     axisRight={null}
//     axisBottom={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: 0,
//       legend: 'transportation',
//       legendOffset: 36,
//       legendPosition: 'middle'
//     }}
//     axisLeft={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: 0,
//       legend: 'count',
//       legendOffset: -40,
//       legendPosition: 'middle'
//     }}
//     pointSize={10}
//     pointColor={{ theme: 'background' }}
//     pointBorderWidth={2}
//     pointBorderColor={{ from: 'serieColor' }}
//     pointLabelYOffset={-12}
//     useMesh={true}
//     legends={[
//       {
//         anchor: 'bottom-right',
//         direction: 'column',
//         justify: false,
//         translateX: 100,
//         translateY: 0,
//         itemsSpacing: 0,
//         itemDirection: 'left-to-right',
//         itemWidth: 80,
//         itemHeight: 20,
//         itemOpacity: 0.75,
//         symbolSize: 12,
//         symbolShape: 'circle',
//         symbolBorderColor: 'rgba(0, 0, 0, .5)',
//         effects: [
//           {
//             on: 'hover',
//             style: {
//               itemBackground: 'rgba(0, 0, 0, .03)',
//               itemOpacity: 1
//             }
//           }
//         ]
//       }
//     ]}
//   />)

export default ChartsPage;
