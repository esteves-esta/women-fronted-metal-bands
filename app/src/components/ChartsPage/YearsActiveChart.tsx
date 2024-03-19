import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveBar } from '@nivo/bar'

import useMatchMedia from '../../helpers/useMatchMedia';
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';

function BandYearsActiveChart() {
  const { databaseChecked } = React.useContext(BandContext)

  const [chartData, setChartData] = React.useState([
    { id: '1', value: 0 },
    { id: '2', value: 0 },
    { id: '3', value: 0 },
    { id: '4', value: 0 },
    { id: '5-10', value: 0 },
    { id: '10-20', value: 0 },
    { id: '20-30', value: 0 },
    { id: '30-40', value: 0 },
    { id: '40-50', value: 0 }
  ])
  const [averageTime, setAverageTime] = React.useState(0)

  // ============================

  const { data, isLoading } = useSWR(
    databaseChecked ? `/time-active` : null,
    fetcher,
    {
      errorRetry,
      revalidateOnFocus: false,
    }
  );

  React.useEffect(() => {
    if (data !== undefined) {
      setChartData(data.chartData);
      setAverageTime(data.average);
    }
  }, [data]);


  const isMediaNarrow = useMatchMedia();

  if (!isLoading)
    return (
      <React.Fragment>
        <p className='text-center title3 mt-10'>
          Average time of activity: {" "}
          <span className='font-black'>{averageTime} years</span>
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
          margin={{ top: 50, right: isMediaNarrow ? 10 : 200, bottom: 50, left: isMediaNarrow ? 10 : 200 }}
          borderRadius={10}
          padding={0.4}
          colors={{ scheme: 'purpleRed_green' }}
          labelTextColor={"white"}
          isInteractive={false}
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
      </React.Fragment>
    )
  else return (<React.Fragment>
    <div className="flex flex-row gap-4 justify-center items-center">
      <p>Loading </p>
      <LoaderSvg width={50} height={50} />
    </div>
  </React.Fragment>)
};

export default BandYearsActiveChart;