import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import colors from './colors'

// heatmap - 
/* 
----qtd de bandas por decada
id - country
x - year - decade 1950 - 2020
x - count

*/

function getIfActiveOnDecade(band, decade) {
  const { yearStarted, yearEnded } = band
  if (yearEnded) {
    // console.log({ yearEnded })
    // console.log({ decade })
    return yearEnded <= decade ? 0 : 1
  }
  
  // console.log({ yearStarted })
  return yearStarted >= decade && yearStarted < (decade + 10) ? 1 : 0
}

function BandCountByDecadeChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartHeatData, setChartHeatData] = React.useState([])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = []
    list.forEach((band) => {

      const already = newChartData.findIndex(data => data.id === band.country)
      if (already >= 0) {
        newChartData[already].data[0].y += getIfActiveOnDecade(band, 1970);
        newChartData[already].data[1].y += getIfActiveOnDecade(band, 1980)
        newChartData[already].data[2].y += getIfActiveOnDecade(band, 1990)
        newChartData[already].data[3].y += getIfActiveOnDecade(band, 2000)
        newChartData[already].data[4].y += getIfActiveOnDecade(band, 2010)
        newChartData[already].data[5].y += getIfActiveOnDecade(band, 2020)
      } else {
        newChartData.push({
          id: band.country,
          data: [
            {
              x: '70s',
              y: getIfActiveOnDecade(band, 1970),
            },
            {
              x: '80s',
              y: getIfActiveOnDecade(band, 1980),
            },
            {
              x: '90s',
              y: getIfActiveOnDecade(band, 1990),
            },
            {
              x: '00s',
              y: getIfActiveOnDecade(band, 2000),
            },
            {
              x: '10s',
              y: getIfActiveOnDecade(band, 2010),
            },
            {
              x: '20s',
              y: getIfActiveOnDecade(band, 2020),
            },
          ]
        })
      }
    })
    setChartHeatData(newChartData)
    // console.log(chartHeatData)
  }, [])

  return (
    <ResponsiveHeatMap
      data={chartHeatData}
      // forceSquare={true}
      margin={{ top: 60, right: 300, bottom: 60, left: 300 }}
      // valueFormat=">-.2s"
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -90,
        legend: '',
        legendOffset: 50
      }}
      axisRight={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: 70
      }}
      colors={{
        type: 'sequential',
        scheme: 'turbo',
        divergeAt: 0.6,
        minValue: 0,
        maxValue: 16
      }}
      emptyColor="#000"
      legends={[
        {
          anchor: 'bottom',
          // translateX: 260,
          translateY: 40,
          length: 300,
          thickness: 10,
          direction: 'row',
          tickPosition: 'after',
          tickSize: 3,
          tickSpacing: 4,
          tickOverlap: false,
          title: 'Value →',
          titleAlign: 'start',
          titleOffset: 4
        }
      ]}
      inactiveOpacity={0.1}
      theme={{
        // "background": "#ffffff",
        "text": {
          "fontSize": 14,
          "fill": "var(--text-color)",
          "outlineWidth": 0,
          "outlineColor": "transparent"
        },
        "tooltip": {
          "container": {
            "background": "#444",
            "fontSize": 14
          },
        }
      }}
    />
  )
};

export default BandCountByDecadeChart;