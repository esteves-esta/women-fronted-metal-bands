import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'

function getIfActiveOnDecade(band, decade) {
  const { yearStarted, yearEnded } = band
  if (yearEnded) {
    return yearEnded <= decade ? 0 : 1
  }

  return yearStarted >= decade && yearStarted < (decade + 10) ? 1 : 0
}

function BandCountByDecadeChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    const newChartData = []
    initialBandList.forEach((band) => {
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
    setChartData(newChartData)
    // console.log(chartHeatData)
  }, [])

  return (
    <ResponsiveHeatMap
      data={chartData}
      // forceSquare={true}
      margin={{ top: 60, right: 300, bottom: 60, left: 300 }}
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