import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { BandContext } from '../BandsProvider';
import colors from './colors'

function ActivityInEachDecadeChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([
    { id: '1970', value: 0 },
    { id: '1980', value: 0 },
    { id: '1990', value: 0 },
    { id: '2000', value: 0 },
    { id: '2010', value: 0 },
    { id: '2020', value: 0 },
  ])

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

  React.useEffect(() => {
    const newChartData = [...chartData]
    initialBandList.forEach((band) => {
      newChartData[0].value += getIfActiveOnDecade(band, 1970);
      newChartData[1].value += getIfActiveOnDecade(band, 1980)
      newChartData[2].value += getIfActiveOnDecade(band, 1990)
      newChartData[3].value += getIfActiveOnDecade(band, 2000)
      newChartData[4].value += getIfActiveOnDecade(band, 2010)
      newChartData[5].value += getIfActiveOnDecade(band, 2020)
    })
    setChartData(newChartData)
    // console.log(chartData)
  }, [])

  return (<ResponsiveBar
    data={chartData}
    keys={[
      'value',
    ]}
    indexBy="id"
    layout="horizontal"
    enableGridX={true}
    enableGridY={false}
    margin={{ top: 50, right: 200, bottom: 50, left: 260 }}
    colors={{ scheme: 'red_yellow_blue' }}
    labelTextColor={'white'}
    barAriaLabel={e => e.id + ": " + e.formattedValue}
    theme={{
      "text": {
        "fontSize": 13,
        "fill": "var(--text-color)",
      },
      "axis": {
        "domain": {
          "line": {
            "stroke": "#444",
            "strokeWidth": 1
          }
        },
        "ticks": {
          "line": {
            "stroke": "#444",
            "strokeWidth": 1
          },
        }
      },
      "grid": {
        "line": {
          "stroke": "#444",
          "strokeDasharray": 20,
          "strokeWidth": 1,
        }
      },
      "tooltip": {
        "container": {
          "background": "#444",
          "fontSize": 12
        },
      }
    }}
  />
  )
};

export default ActivityInEachDecadeChart;