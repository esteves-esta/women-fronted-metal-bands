import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import formatYearsActive from '../../helpers/formatYearsActive';

function BandYearsActiveByCountryChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    const newChartData = []

    initialBandList.forEach((band) => {
      const indexFound = newChartData.findIndex(data => data.id === band.country)
      const yearsActive = formatYearsActive(band)

      if (indexFound >= 0) {
        newChartData[indexFound].data[0].y += yearsActive < 5 ? 1 : 0;
        newChartData[indexFound].data[1].y += yearsActive >= 5 && yearsActive < 10 ? 1 : 0;
        newChartData[indexFound].data[2].y += yearsActive >= 20 && yearsActive < 30 ? 1 : 0;
        newChartData[indexFound].data[3].y += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
        newChartData[indexFound].data[4].y += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
        newChartData[indexFound].data[5].y += yearsActive >= 40 && yearsActive < 50 ? 1 : 0;
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

    setChartData(newChartData)
  }, [])

  return (
    <ResponsiveHeatMap
      data={chartData}
      // forceSquare={true}
      margin={{ top: 90, right: 300, bottom: 60, left: 300 }}
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
        type: 'diverging',
        scheme: 'sinebow',
        divergeAt: 0.7,
        minValue: 0,
        maxValue: 15
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

export default BandYearsActiveByCountryChart;