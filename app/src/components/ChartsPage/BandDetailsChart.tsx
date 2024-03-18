import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import { BandContext } from '../BandsProvider';
import classes from './ChartsPage.module.css'
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
function BandDetailsChart({ filter }) {

  const { databaseChecked } = React.useContext(BandContext)
  const [chartDetails, setChartDetails] = React.useState({
    allwomenData:
      [{ id: "all women", value: 0 }, { id: "mixed", value: 0 }],
    blackwomenData: [{ id: "other", value: 0 }, { id: "black women", value: 0 }],
    sisterData: [{ id: "yes", value: 0 }, { id: "no", value: 0 }],
    statusData: [{ id: "active", value: 0 }, { id: "disbanded", value: 0 }]
  });

  const { data, isLoading } = useSWR(
    databaseChecked ? `/details/${filter === 'viewAll' ? 'null' : filter}` : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false,
    }
  );

  React.useEffect(() => {
    if (data !== undefined) {
      setChartDetails(data);
    }
  }, [data]);

  if (!isLoading)
    return (
      <div>
        <div className={`flex flex-col md:flex-row items-center justify-center mt-5 ${classes.borderBottom}`}>
          <div className={`flex flex-col pb-4 ${classes.borderRight}`}>
            <PieChartCustom colors={{ scheme: 'purpleRed_green' }} data={chartDetails.allwomenData} />
            <small className='title2 text-center'>
              All women band
            </small>
          </div>
          <div className='flex flex-col pb-4'>
            <PieChartCustom colors={{ scheme: 'pink_yellowGreen' }} data={chartDetails.blackwomenData} />
            <small className='title2 text-center'>
              Black women
            </small>
          </div>
        </div>

        <div className='flex flex-col md:flex-row  items-center justify-center' >
          <div className={`flex flex-col pb-4 ${classes.borderRight}`}>
            <PieChartCustom colors={{ scheme: 'category10' }} data={chartDetails.sisterData} />
            <small className='title2 text-center'>
              Sisters
            </small>
          </div>
          <div className='flex flex-col pb-4 '>
            <PieChartCustom colors={{ scheme: 'paired' }} data={chartDetails.statusData} />
            <small className='title2 text-center'>
              Band status
            </small>
          </div>
        </div>
      </div>
    )
  else
    return (<p>Loading...</p>)
};


const PieChartCustom = ({ data, /* startAngle, endAngle, */ colors, /* style */ }) => {
  return (
    <div className={classes.container}>
      <ResponsivePie
        data={data}
        fit={true}
        margin={{ left: 30, right: 30 }}
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