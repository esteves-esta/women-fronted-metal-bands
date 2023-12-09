import React from 'react';
import { ResponsiveWaffle } from '@nivo/waffle'
import { BandContext } from '../BandsProvider';
import colors from './colors'

function BandCountByContryChart({ filter, filterGrow }) {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const [bandCount, setBandCount] = React.useState(0)

  React.useEffect(() => {
    const newChartData = []
    let colorIndex = colors.length - 1
    let bandCount = 0

    let bandListFiltered = [...initialBandList]
    if (filterGrow !== 'viewAll') {
      bandListFiltered = bandListFiltered.filter(band => band.growling === Number(filterGrow))
    }

    bandListFiltered.forEach((band) => {
      const indexFound = newChartData.findIndex(data => data.id === band.country)
      if (filter === 'active' && band.yearEnded) return
      if (filter === 'disbanded' && !band.yearEnded) return
      if (filter === 'all women' && !band.allWomenBand) return
      if (filter === 'mixed' && band.allWomenBand) return
      if (filter === 'sister' && !band.sister) return
      if (filter === 'black women' && !band.blackWomen) return

      if (indexFound >= 0) {
        newChartData[indexFound].value += 1;
      } else {
        newChartData.push({
          color: colors[colorIndex],
          id: band.country,
          label: band.countryCode,
          value: 1
        })
        colorIndex -= 1
      }
      bandCount++;
    })
    setBandCount(bandCount)
    newChartData.sort((a, b) => b.value - a.value);
    setChartData(newChartData)
  }, [filter, filterGrow])

  return (<React.Fragment>
    <div className='flex flex-row gap-5 justify-center'>
      <p className='text-center title3 mt-10'>
         Total countries: {" "}
        <span className='font-black'> {chartData.length}</span>
      </p>

      <p className='text-center title3 mt-10'>
         Total bands : {" "}
        <span className='font-black'>{bandCount}</span>
      </p>
    </div>

    <ResponsiveWaffle
      data={chartData}
      total={initialBandList.length + 5}
      rows={10}
      columns={(initialBandList.length + 5) / 5}
      padding={2}
      borderRadius={10}
      fillDirection='right'
      motionStagger={2}
      emptyColor='#444'
      colors={{
        datum: 'color'
      }}
      margin={{ left: 30, right: 30, top: 0 }}
      // legends={[
      //   {
      //     anchor: 'top-left',
      //     direction: 'row',
      //     padding: 10,
      //     translateY: -30,
      //     itemsSpacing: 4,
      //     itemWidth: 40,
      //     itemHeight: 5,
      //     itemDirection: 'left-to-right',
      //     itemTextColor: '#fff ',
      //     symbolSize: 10,
      //     symbolShape: 'circle',
      //     effects: [
      //       {
      //         on: 'hover',
      //         style: {
      //           itemOpacity: 0.5,
      //         }
      //       }
      //     ]
      //   }
      // ]}
      tooltip={
        ({ data }) => {
          return (<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row', padding: 12, backgroundColor: "#444", }}>
            <div style={{ backgroundColor: data.color, height: '15px', width: '15px' }}></div>
            <strong>{data.id}: {data.value}</strong>
          </div >)
        }
      }
    />
  </React.Fragment>
  )
};

export default BandCountByContryChart;