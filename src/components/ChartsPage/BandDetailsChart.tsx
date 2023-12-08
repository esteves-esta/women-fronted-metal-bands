import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import { BandContext } from '../BandsProvider';
import classes from './ChartsPage.module.css'

function BandDetailsChart({ filter }) {
  const { initialBandList } = React.useContext(BandContext)
  const [allwomenData, setAllwomenData] = React.useState([
    { id: 'all women', value: 0 },
    { id: 'mixed', value: 0 },
  ])
  const [blackwomenData, setBlackwomenData] = React.useState([
    { id: 'other', value: 0 },
    { id: 'black women', value: 0 },
  ])
  const [sisterData, setSisterData] = React.useState([
    { id: 'yes', value: 0 },
    { id: 'no', value: 0 },
  ])

  const [statusData, setStatusData] = React.useState([
    { id: 'active', value: 0 },
    { id: 'disbanded', value: 0 },
  ])

  React.useEffect(() => {
    const newChartData = [...allwomenData]
    newChartData[0].value = 0;
    newChartData[1].value = 0;

    initialBandList.forEach((band) => {
      if (filter === 'active' && band.yearEnded) return
      if (filter === 'disbanded' && !band.yearEnded) return

      newChartData[0].value += band.allWomenBand ? 1 : 0;
      newChartData[1].value += band.allWomenBand ? 0 : 1

    })
    setAllwomenData(newChartData)
  }, [filter])

  React.useEffect(() => {
    const newChartData = [...blackwomenData]
    newChartData[0].value = 0;
    newChartData[1].value = 0;

    initialBandList.forEach((band) => {
      if (filter === 'active' && band.yearEnded) return
      if (filter === 'disbanded' && !band.yearEnded) return

      newChartData[1].value += band.blackWomen ? 1 : 0;
      newChartData[0].value += band.blackWomen ? 0 : 1

    })
    setBlackwomenData(newChartData)
  }, [filter])

  React.useEffect(() => {
    const newChartData = [...sisterData]
    newChartData[0].value = 0;
    newChartData[1].value = 0;

    initialBandList.forEach((band) => {
      if (filter === 'active' && band.yearEnded) return
      if (filter === 'disbanded' && !band.yearEnded) return

      newChartData[0].value += band.sister ? 1 : 0;
      newChartData[1].value += band.sister ? 0 : 1

    })
    setSisterData(newChartData)
  }, [filter])

  React.useEffect(() => {
    const newChartData = [...statusData]
    initialBandList.forEach((band) => {
      newChartData[0].value += band.yearEnded ? 0 : 1;
      newChartData[1].value += band.yearEnded ? 1 : 0

    })
    setStatusData(newChartData)
  }, [])

  return (
    <div>
      <div className={`flex flex-row justify-center mt-5 ${classes.borderBottom}`}>
        <div className={`flex flex-col pb-4 ${classes.borderRight}`}>
          <PieChartCustom colors={{ scheme: 'purpleRed_green' }} data={allwomenData} /* style={{ "borderRight": '2px solid red' }} */ />
          <small className='title2 text-center'>
            All women band
          </small>
        </div>
        <div className='flex flex-col pb-4'>
          <PieChartCustom colors={{ scheme: 'pink_yellowGreen' }} data={blackwomenData} /* style={{}} */ />
          <small className='title2 text-center'>
            Black women
          </small>
        </div>
      </div>

      <div className='flex flex-row justify-center' >
        <div className={`flex flex-col pb-4 ${classes.borderRight}`}>
          <PieChartCustom colors={{ scheme: 'category10' }} data={sisterData} /* style={{ "borderRight": '2px solid red' }} */ />
          <small className='title2 text-center'>
            Sisters
          </small>
        </div>
        <div className='flex flex-col pb-4'>
          <PieChartCustom colors={{ scheme: 'paired' }} data={statusData} /* style={{}} */ />
          <small className='title2 text-center'>
            Band status
          </small>
        </div>
      </div>
    </div>
  )
};


const PieChartCustom = ({ data, /* startAngle, endAngle, */ colors, /* style */ }) => {
  return (
    <div style={{ height: "350px", width: '350px',/*  ...style */ }}>
      <ResponsivePie
        data={data}
        fit={true}
        margin={{ left: 20, right: 20 }}
        innerRadius={0.3}
        padAngle={2}
        startAngle={-90}
        endAngle={90}
        cornerRadius={4}
        colors={colors}
        activeOuterRadiusOffset={5}
        // sortByValue={true}

        arcLabelsSkipAngle={10}
        arcLabelsTextColor="white"

        enableArcLinkLabels={false}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabelsTextColor="#fff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsSkipAngle={10}

        // arcLinkLabelsDiagonalLength={-30}
        // arcLinkLabelsStraightLength={0}
        // arcLinkLabelsOffset={-110}
        // arcLinkLabelsTextOffset={-35}

        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 30,
            translateY: -50,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 30,
            itemTextColor: '#999',
            // itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.1)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        theme={{
          "tooltip": {
            "container": {
              "background": "#444",
              "fontSize": 12
            },
          }
        }}
      />
    </div>
  )
}

export default BandDetailsChart;