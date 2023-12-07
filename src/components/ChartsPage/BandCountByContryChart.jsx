import React from 'react';
import { ResponsiveWaffle } from '@nivo/waffle'
import { BandContext } from '../BandsProvider';
import colors from './colors'

function BandCountByContryChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartWaffleData, setChartWaffleData] = React.useState([])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = []
    let colorIndex = colors.length - 1

    list.forEach((band, index) => {
      // console.log(band)
      const alredy = newChartData.findIndex(data => data.id === band.country)
      if (alredy >= 0) {
        newChartData[alredy].value += 1;
      } else {
        newChartData.push({
          color: colors[colorIndex],
          id: band.country,
          label: band.countryCode,
          value: 1
        })
        colorIndex -= 1
      }
    })
    newChartData.sort((a, b) => b.value - a.value);
    setChartWaffleData(newChartData)
    // console.log(newChartData)
  }, [])

  return (<ResponsiveWaffle
    data={chartWaffleData}
    total={initialBandList.length + 5}
    rows={5}
    columns={30}
    padding={2}
    borderRadius={10}
    fillDirection='right'
    motionStagger={2}
    emptyColor='#444'
    colors={{
      datum: 'color'
    }}
    margin={{ left: 30, right: 30 }}
    legends={[
      {
        anchor: 'top-left',
        direction: 'row',
        padding: 10,
        translateY: 40,
        itemsSpacing: 4,
        itemWidth: 40,
        itemHeight: 5,
        itemDirection: 'left-to-right',
        itemTextColor: '#fff ',
        symbolSize: 10,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 0.5,
            }
          }
        ]
      }
    ]}
    tooltip={
      ({ data }) => {
        return (<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row', padding: 12, backgroundColor: "#444", }}>
          <div style={{ backgroundColor: data.color, height: '15px', width: '15px' }}></div>
          <strong>{data.id}: {data.value}</strong>
        </div >)
      }
    }
  />
  )
};

export default BandCountByContryChart;