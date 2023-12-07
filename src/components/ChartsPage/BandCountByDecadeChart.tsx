import React from 'react';
import { ResponsiveWaffle } from '@nivo/waffle'
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import colors from './colors'

// heatmap - 
/* 
----qtd de bandas por decada
id - country
x - year - decade 1950 - 2020
x - count

---- active years
id - country
x: 1 - y: count
1 a 5
5 a 10
10 a 20
20 a 30
*/

function BandCountByDecadeChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartHeatData, setChartHeatData] = React.useState([])

  const formatYearsActive = React.useCallback((data) => {
    const { yearStarted, yearEnded } = data;

    const thisYear = new Date().getFullYear()

    let activeYears = 0
    if (yearStarted !== null) {
      activeYears = thisYear - yearStarted
      if (yearEnded) activeYears = yearEnded - yearStarted
    }
    return activeYears;
  }, []);


  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = []
    list.forEach((band) => {
      // console.log(band)
      const alredy = newChartData.findIndex(data => data.id === band.country)
      const yearsActive = formatYearsActive(band)
      if (alredy >= 0) {
        newChartData[alredy].data[0].y += yearsActive < 5 ? 1 : 0;
        newChartData[alredy].data[1].y += yearsActive >= 5 && yearsActive < 10 ? 1 : 0;
        newChartData[alredy].data[2].y += yearsActive >= 20 && yearsActive < 30 ? 1 : 0;
        newChartData[alredy].data[3].y += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
        newChartData[alredy].data[4].y += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
        newChartData[alredy].data[5].y += yearsActive >= 40 && yearsActive < 50 ? 1 : 0;
      } else {
        newChartData.push({
          id: band.country,
          data: [
            {
              x: '1 to 5',
              y: yearsActive < 5 ? 1 : 0,
            },
            {
              x: '5 to 10',
              y: yearsActive >= 5 && yearsActive < 10 ? 1 : 0,
            },
            {
              x: '10 to 20',
              y: yearsActive >= 10 && yearsActive < 20 ? 1 : 0,
            },
            {
              x: '20 to 30',
              y: yearsActive >= 20 && yearsActive < 30 ? 1 : 0,
            },
            {
              x: '30 to 40',
              y: yearsActive >= 30 && yearsActive < 40 ? 1 : 0,
            },
            {
              x: '40 to 50',
              y: yearsActive >= 40 && yearsActive < 50 ? 1 : 0,
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
      forceSquare={true}
      margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
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
          anchor: 'center',
          translateX: 260,
          translateY: 0,
          length: 300,
          thickness: 10,
          direction: 'column',
          tickPosition: 'after',
          tickSize: 10,
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