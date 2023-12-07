import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import { BandContext } from '../BandsProvider';

function BandDetailsChart() {
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
    const list = [...initialBandList];
    const newChartData = [...allwomenData]
    list.forEach((band) => {
      newChartData[0].value += band.allWomenBand ? 1 : 0;
      newChartData[1].value += band.allWomenBand ? 0 : 1

    })
    setAllwomenData(newChartData)
  }, [])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = [...blackwomenData]
    list.forEach((band) => {
      newChartData[1].value += band.blackWomen ? 1 : 0;
      newChartData[0].value += band.blackWomen ? 0 : 1

    })
    setBlackwomenData(newChartData)
  }, [])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = [...sisterData]
    list.forEach((band) => {
      newChartData[1].value += band.sister ? 1 : 0;
      newChartData[0].value += band.sister ? 0 : 1

    })
    setSisterData(newChartData)
  }, [])

  React.useEffect(() => {
    const list = [...initialBandList];
    const newChartData = [...statusData]
    list.forEach((band) => {
      newChartData[0].value += band.yearEnded ? 1 : 0;
      newChartData[1].value += band.yearEnded ? 0 : 1

    })
    setStatusData(newChartData)
  }, [])

  return (
    <div>
      <div className='flex flex-row justify-center mt-20'  /* style={{ "borderBottom": '2px solid #444' }} */>
        <PieChartCustom colors={{scheme: 'purpleRed_green' }} data={allwomenData} startAngle={-90} endAngle={0} /* style={{ "borderRight": '2px solid red' }} */ />
        <PieChartCustom colors={{ scheme: 'pink_yellowGreen' }} data={blackwomenData} startAngle={0} endAngle={90} /* style={{}} */ />
      </div>

      <div className='flex flex-row justify-center'>
        <PieChartCustom colors={{ scheme: 'red_blue' }} data={sisterData} startAngle={-90} endAngle={-180} /* style={{ "borderRight": '2px solid red' }} */ />
        <PieChartCustom colors={{ scheme: 'paired' }} data={statusData} startAngle={90} endAngle={180} /* style={{}} */ />
      </div>
    </div>
  )
};


const PieChartCustom = ({ data, startAngle, endAngle, colors, /* style */ }) => {
  return (
    <div style={{ height: "300px", width: '300px',/*  ...style */ }}>
      <ResponsivePie

        data={data}
        fit={true}
        margin={{ top: 10, left: 10}}
        innerRadius={0.6}
        padAngle={0.9}
        startAngle={startAngle}
        endAngle={endAngle}
        cornerRadius={3}
        colors={colors}
        activeOuterRadiusOffset={20}
        
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="white"

        arcLinkLabelsColor={{ from: 'color' }}
        arcLinkLabelsTextColor="#fff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsSkipAngle={10}
        
        arcLinkLabelsDiagonalLength={-30}
        arcLinkLabelsStraightLength={0}
        arcLinkLabelsOffset={-110}
        arcLinkLabelsTextOffset={-35}

        // legends={[
        //   {
        //     anchor: 'top-left',
        //     direction: 'column',
        //     justify: false,
        //     // translateX: -110,
        //     // translateY: 56,
        //     itemsSpacing: 0,
        //     itemWidth: 100,
        //     itemHeight: 18,
        //     itemTextColor: '#999',
        //     // itemDirection: 'left-to-right',
        //     itemOpacity: 1,
        //     symbolSize: 18,
        //     symbolShape: 'circle',
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemTextColor: '#000'
        //         }
        //       }
        //     ]
        //   }
        // ]}
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
        fill={[
          {
            match: {
              id: 'mixed'
            },
            id: 'lines'
          }
        ]}

      />
    </div>
  )
}

export default BandDetailsChart;