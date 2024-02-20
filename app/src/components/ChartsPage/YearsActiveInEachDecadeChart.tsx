import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { BandContext } from '../BandsProvider';
import { getIfActiveOnDecade } from './GetIfActiveOnDecade';
import useMatchMedia from '../../helpers/useMatchMedia';

function ActivityInEachDecadeChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    const newChartData = [{ id: '1970', value: 0 },
    { id: '1980', value: 0 },
    { id: '1990', value: 0 },
    { id: '2000', value: 0 },
    { id: '2010', value: 0 },
    { id: '2020', value: 0 }]

    initialBandList.forEach((band, index) => {
      newChartData[0].value += getIfActiveOnDecade(band, 1970);
      newChartData[1].value += getIfActiveOnDecade(band, 1980)
      newChartData[2].value += getIfActiveOnDecade(band, 1990)
      newChartData[3].value += getIfActiveOnDecade(band, 2000)
      newChartData[4].value += getIfActiveOnDecade(band, 2010)
      // console.log(band.yearStarted, index)
      newChartData[5].value += getIfActiveOnDecade(band, 2020)
    })
    setChartData(newChartData)
    // console.log(chartData)
  }, [])
  const isMediaNarrow = useMatchMedia();

  return (<ResponsiveBar
    data={chartData}
    keys={[
      'value',
    ]}
    indexBy="id"
    layout="horizontal"
    enableGridX={true}
    enableGridY={false}
    isInteractive={false}
    margin={{ top: 50, right: isMediaNarrow ? 10 : 200, bottom: 50, left: isMediaNarrow ? 10 : 200 }}
    borderRadius={10}
    padding={0.4}
    colors={{ scheme: 'red_yellow_blue' }}
    labelTextColor={'white'}
    barAriaLabel={e => e.id + ": " + e.value}
    theme={{
      "text": {
        "fontSize": 13,
        "fill": "var(--text-color)",
      },
      "axis": {
        "domain": {
          "line": {
            "stroke": "var(--border-color)",
            "strokeWidth": 1
          }
        },
        "ticks": {
          "line": {
            "stroke": "var(--border-color)",
            "strokeWidth": 1
          },
        }
      },
      "grid": {
        "line": {
          "stroke": "var(--border-color)",
          "strokeDasharray": 20,
          "strokeWidth": 1,
        }
      },

    }}
  />
  )
};

export default ActivityInEachDecadeChart;