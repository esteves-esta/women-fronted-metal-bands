import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { BandContext } from '../BandsProvider';
import useSWR from "swr";
import useMatchMedia from '../../helpers/useMatchMedia';
import { errorRetry, fetcher } from './apiFunctions';

import ChartLoader from './ChartLoader';

function ActivityInEachDecadeChart() {
  const { databaseChecked } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])


  const {
    data,
    isLoading,
  } = useSWR(databaseChecked ? `/years-active-in-each-decade` : null, fetcher, {
    errorRetry,
    revalidateOnFocus: false,
  });

  React.useEffect(() => {
    if (data !== undefined) {
      setChartData(data);
    }
  }, [data]);

  // ============================
  const isMediaNarrow = useMatchMedia();

  if (!isLoading)
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

  else return (<ChartLoader />)
};


export default ActivityInEachDecadeChart;