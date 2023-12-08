import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveBar } from '@nivo/bar'
import formatYearsActive from '../../helpers/formatYearsActive';

function BandYearsActiveChart() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([
    { id: '1-5', value: 0 },
    { id: '5-10', value: 0 },
    { id: '10-20', value: 0 },
    { id: '20-30', value: 0 },
    { id: '30-40', value: 0 },
    { id: '40-50', value: 0 }
  ])
  const [averageTime, setAverageTime] = React.useState(0)

  React.useEffect(() => {
    const newChartData = [...chartData]
    console.log(chartData)
    let average = 0

    initialBandList.forEach((band) => {
      const yearsActive = formatYearsActive(band)
      average += yearsActive;

      newChartData[0].value += yearsActive < 5 ? 1 : 0;
      newChartData[1].value += yearsActive >= 5 && yearsActive < 10 ? 1 : 0;
      newChartData[2].value += yearsActive >= 20 && yearsActive < 30 ? 1 : 0;
      newChartData[3].value += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
      newChartData[4].value += yearsActive >= 30 && yearsActive < 40 ? 1 : 0;
      newChartData[5].value += yearsActive >= 40 && yearsActive < 50 ? 1 : 0;

    })

    setAverageTime(Math.round(average / initialBandList.length))
    setChartData(newChartData)
  }, [])

  return (
    <React.Fragment>
      <p className='text-center title3 mt-10'>
        Average time of activity: {" "}
        <span className='font-black'>{averageTime}</span>
      </p>
      <ResponsiveBar
        data={chartData}
        keys={[
          'value'
        ]}
        indexBy="id"
        layout="horizontal"
        enableGridX={true}
        enableGridY={false}
        margin={{ top: 50, right: 200, bottom: 50, left: 260 }}
        colors={{ scheme: 'purpleRed_green' }}
        labelTextColor={"white"}
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
    </React.Fragment>
  )
};

export default BandYearsActiveChart;