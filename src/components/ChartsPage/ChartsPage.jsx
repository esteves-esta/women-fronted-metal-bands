import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { ResponsiveWaffle } from '@nivo/waffle'
import { ResponsiveLine } from '@nivo/line'

import classes from './ChartsPage.module.css'
import { BandContext } from '../BandsProvider';

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

/* 
pi

- active
- all women band
- black women
- sisters
*/


// waffle
/* 
qtd de bandas por pais
*/

function ChartsPage() {
  const { initialBandList } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const [chartHeatData, setChartHeatData] = React.useState([])
  const [chartWaffleData, setChartWaffleData] = React.useState([])

  const colors = ["#c5d783",
    "#723ece",
    "#77e14d",
    "#c94aca",
    "#cfdd41",
    "#572b86",
    "#6da837",
    "#6a6ed5",
    "#d5ab3a",
    "#342758",
    "#65d989",
    "#d74087",
    "#63d8c2",
    "#db3f3b",
    "#8cc8e1",
    "#d47332",
    "#7194d3",
    "#477631",
    "#c379c1",
    "#8b7733",
    "#88345c",
    "#bdd6b9",
    "#47222d",
    "#dbb088",
    "#233a37",
    "#d6757a",
    "#598a69",
    "#883925",
    "#5b9098",
    "#4b4626",
    "#d1abcd",
    "#5d6085",
    "#9a776d"];

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
    console.log(chartData)
  }, [])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = []
    list.forEach((band) => {
      // console.log(band)
      const alredy = newChartData.findIndex(data => data.id === band.country)
      if (alredy >= 0) {
        newChartData[alredy].data[band.growling].y = + 1
      } else {
        newChartData.push({
          id: band.country,
          data: [
            {
              x: 'None',
              y: band.growling === 0 ? 1 : 0,
            },
            {
              x: 'Few',
              y: band.growling === 1 ? 1 : 0,
            },
            {
              x: 'Medium',
              y: band.growling === 2 ? 1 : 0,
            },
            {
              x: 'High',
              y: band.growling === 3 ? 1 : 0,
            },
          ]
        })
      }
    })
    setChartHeatData(newChartData)
    // console.log(chartHeatData)
  }, [])

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
          label: band.country,
          value: 1
        })
        colorIndex -= 1
      }
    })
    newChartData.sort((a, b) => b.value - a.value);
    setChartWaffleData(newChartData)
    // console.log(newChartData)
  }, [])

  return <div className={classes.container}>

    <div style={{ height: '800px' }}>
      <MyResponsiveBar data={chartData} />
    </div>

    {/* <div style={{ height: '500px' }}>
      <MyResponsiveHeatMap data={chartHeatData} />
    </div> */}

    <div style={{ height: '300px' }}>
      <MyResponsiveWaffle data={chartWaffleData} />
    </div>

    {/* <div style={{ height: '500px' }}>
      <MyResponsiveLine data={chartHeatData} />
    </div> */}

  </div>;
}


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBar = ({ data /* see data tab */ }) => (
  <ResponsiveBar
    data={data}
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

const MyResponsiveHeatMap = ({ data /* see data tab */ }) => (
  <ResponsiveHeatMap
    data={data}
    margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
    // valueFormat=">-.2s"
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -90,
      legend: '',
      legendOffset: 46
    }}
    axisRight={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: 70
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: -72
    }}
    colors={{
      type: 'diverging',
      scheme: 'red_yellow_blue',
      divergeAt: 0.5,
      minValue: 0,
      maxValue: 2
    }}
    emptyColor="#444"
    legends={[
      {
        anchor: 'bottom',
        translateX: 0,
        translateY: 30,
        length: 400,
        thickness: 8,
        direction: 'row',
        tickPosition: 'after',
        tickSize: 3,
        tickSpacing: 4,
        tickOverlap: false,
        tickFormat: '>-.2s',
        title: 'Value →',
        titleAlign: 'start',
        titleOffset: 4
      }
    ]}
    theme={{
      // "background": "#ffffff",
      "text": {
        "fontSize": 11,
        "fill": "var(--text-color)",
        "outlineWidth": 0,
        "outlineColor": "transparent"
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

const MyResponsiveWaffle = ({ data /* see data tab */ }) => (
  <ResponsiveWaffle
    data={data}
    total={150}
    rows={10}
    columns={30}
    padding={1}
    fillDirection='right'
    emptyColor='#444'
    margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
    // colors={{ scheme: 'yellow_orange_red' }}
    colors={{
      datum: 'color'
    }}
    borderRadius={10}
    borderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          0.3
        ]
      ]
    }}
    motionStagger={2}
    legends={[
      {
        anchor: 'top-left',
        direction: 'column',
        justify: false,
        translateX: -100,
        translateY: 0,
        itemsSpacing: 4,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        itemTextColor: '#fff',
        symbolSize: 20,
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#fff',
              itemBackground: 'blue'
            }
          }
        ]
      }
    ]}
    theme={{
      // "background": "#ffffff",
      // "text": {
      //   "fontSize": 11,
      //   "fill": "red",
      //   "outlineWidth": 0,
      //   "outlineColor": "transparent"
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

const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle'
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
  />)

export default ChartsPage;


const data = [
  {
    "country": "AD",
    "hot dog": 22,
    "hot dogColor": "hsl(124, 70%, 50%)",
    "burger": 77,
    "burgerColor": "hsl(15, 70%, 50%)",
    "sandwich": 93,
    "sandwichColor": "hsl(325, 70%, 50%)",
    "kebab": 135,
    "kebabColor": "hsl(338, 70%, 50%)",
    "fries": 29,
    "friesColor": "hsl(6, 70%, 50%)",
    "donut": 124,
    "donutColor": "hsl(327, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 61,
    "hot dogColor": "hsl(17, 70%, 50%)",
    "burger": 38,
    "burgerColor": "hsl(11, 70%, 50%)",
    "sandwich": 140,
    "sandwichColor": "hsl(104, 70%, 50%)",
    "kebab": 3,
    "kebabColor": "hsl(313, 70%, 50%)",
    "fries": 16,
    "friesColor": "hsl(351, 70%, 50%)",
    "donut": 81,
    "donutColor": "hsl(233, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 161,
    "hot dogColor": "hsl(44, 70%, 50%)",
    "burger": 17,
    "burgerColor": "hsl(49, 70%, 50%)",
    "sandwich": 125,
    "sandwichColor": "hsl(194, 70%, 50%)",
    "kebab": 194,
    "kebabColor": "hsl(18, 70%, 50%)",
    "fries": 17,
    "friesColor": "hsl(222, 70%, 50%)",
    "donut": 106,
    "donutColor": "hsl(205, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 170,
    "hot dogColor": "hsl(290, 70%, 50%)",
    "burger": 65,
    "burgerColor": "hsl(2, 70%, 50%)",
    "sandwich": 197,
    "sandwichColor": "hsl(218, 70%, 50%)",
    "kebab": 71,
    "kebabColor": "hsl(138, 70%, 50%)",
    "fries": 189,
    "friesColor": "hsl(344, 70%, 50%)",
    "donut": 37,
    "donutColor": "hsl(108, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 165,
    "hot dogColor": "hsl(50, 70%, 50%)",
    "burger": 46,
    "burgerColor": "hsl(110, 70%, 50%)",
    "sandwich": 160,
    "sandwichColor": "hsl(272, 70%, 50%)",
    "kebab": 51,
    "kebabColor": "hsl(166, 70%, 50%)",
    "fries": 181,
    "friesColor": "hsl(344, 70%, 50%)",
    "donut": 27,
    "donutColor": "hsl(216, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 109,
    "hot dogColor": "hsl(70, 70%, 50%)",
    "burger": 7,
    "burgerColor": "hsl(306, 70%, 50%)",
    "sandwich": 83,
    "sandwichColor": "hsl(325, 70%, 50%)",
    "kebab": 98,
    "kebabColor": "hsl(67, 70%, 50%)",
    "fries": 147,
    "friesColor": "hsl(69, 70%, 50%)",
    "donut": 13,
    "donutColor": "hsl(197, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 9,
    "hot dogColor": "hsl(268, 70%, 50%)",
    "burger": 70,
    "burgerColor": "hsl(66, 70%, 50%)",
    "sandwich": 167,
    "sandwichColor": "hsl(163, 70%, 50%)",
    "kebab": 35,
    "kebabColor": "hsl(116, 70%, 50%)",
    "fries": 123,
    "friesColor": "hsl(222, 70%, 50%)",
    "donut": 181,
    "donutColor": "hsl(324, 70%, 50%)"
  }
]