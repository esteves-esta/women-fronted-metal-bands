import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { BandContext } from '../BandsProvider';
import colors from './colors'

function ByCountryBoolean() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = []
    list.forEach((band) => {
      // console.log(band)
      const alredy = newChartData.findIndex(data => data.id === band.country)
      if (alredy >= 0) {
        newChartData[alredy].blackWomen += band.blackWomen ? 1 : 0;
        newChartData[alredy].allWomenBand += band.allWomenBand ? 1 : 0;
        newChartData[alredy].active += !band.yearEnded ? 1 : 0,
          newChartData[alredy].sisters += band.sister ? 1 : 0;
      } else {
        newChartData.push({
          id: band.country,
          blackWomen: band.blackWomen ? 1 : 0,
          allWomenBand: band.allWomenBand ? 1 : 0,
          active: !band.yearEnded ? 1 : 0,
          sisters: band.sister ? 1 : 0,
        })
      }
    })
    setChartData(newChartData)
    // console.log(chartData)
  }, [])

  return (<ResponsiveBar
    data={chartData}
    keys={[
      'active',
      'blackWomen',
      'allWomenBand',
      'sisters',
    ]}
    indexBy="id"
    groupMode="stacked"
    layout="horizontal"
    enableGridY={false}
    margin={{ top: 50, right: 130, bottom: 50, left: 260 }}
    // padding={0.2}
    valueScale={{ type: 'point' }}
    colors={{ scheme: 'paired' }}
    labelTextColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          2
        ]
      ]
    }}
    legends={
      [
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 123,
          translateY: 4,
          itemsSpacing: 2,
          itemWidth: 126,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    role="application"
    ariaLabel="Nivo bar chart demo"
    barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    // tooltip={
    //   ({ id, value, color }) => <div style={{ padding: 12, color, background: '#222222' }}><strong>{id}: {value}</strong></div>
    // }
    theme={{
      // "background": "#ffffff",
      "text": {
        "fontSize": 11,
        "fill": "var(--text-color)",
        "outlineWidth": 0,
        "outlineColor": "transparent"
      },
      // "axis": {
      //   "domain": {
      //     "line": {
      //       "stroke": "#777777",
      //       "strokeWidth": 1
      //     }
      //   },
      //   "legend": {
      //     "text": {
      //       "fontSize": 12,
      //       "fill": "#333333",
      //       "outlineWidth": 0,
      //       "outlineColor": "transparent"
      //     }
      //   },
      //   "ticks": {
      //     "line": {
      //       "stroke": "#777777",
      //       "strokeWidth": 1
      //     },
      //     "text": {
      //       "fontSize": 11,
      //       "fill": "#333333",
      //       "outlineWidth": 0,
      //       "outlineColor": "transparent"
      //     }
      //   }
      // },
      // "grid": {
      //   "line": {
      //     "stroke": "#dddddd",
      //     "strokeWidth": 1
      //   }
      // },
      // "legends": {
      //   "title": {
      //     "text": {
      //       "fontSize": 11,
      //       "fill": "#333333",
      //       "outlineWidth": 0,
      //       "outlineColor": "transparent"
      //     }
      //   },
      //   "text": {
      //     "fontSize": 11,
      //     "fill": "#333333",
      //     "outlineWidth": 0,
      //     "outlineColor": "transparent"
      //   },
      //   "ticks": {
      //     "line": {},
      //     "text": {
      //       "fontSize": 10,
      //       "fill": "#333333",
      //       "outlineWidth": 0,
      //       "outlineColor": "transparent"
      //     }
      //   }
      // },
      // "annotations": {
      //   "text": {
      //     "fontSize": 13,
      //     "fill": "#333333",
      //     "outlineWidth": 2,
      //     "outlineColor": "#ffffff",
      //     "outlineOpacity": 1
      //   },
      //   "link": {
      //     "stroke": "#000000",
      //     "strokeWidth": 1,
      //     "outlineWidth": 2,
      //     "outlineColor": "#ffffff",
      //     "outlineOpacity": 1
      //   },
      //   "outline": {
      //     "stroke": "#000000",
      //     "strokeWidth": 2,
      //     "outlineWidth": 2,
      //     "outlineColor": "#ffffff",
      //     "outlineOpacity": 1
      //   },
      //   "symbol": {
      //     "fill": "#000000",
      //     "outlineWidth": 2,
      //     "outlineColor": "#ffffff",
      //     "outlineOpacity": 1
      //   }
      // },
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

export default ByCountryBoolean;