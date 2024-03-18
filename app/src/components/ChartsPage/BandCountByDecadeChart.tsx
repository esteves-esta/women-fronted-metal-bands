import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import useMatchMedia from '../../helpers/useMatchMedia';

import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';

function BandCountByDecadeChart() {
  const { databaseChecked } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const isMediaNarrow = useMatchMedia();

  // ============================

  const { data, isLoading } =
    useSWR(databaseChecked ? `/active-by-each-decade` : null, fetcher, {
      errorRetry,
      revalidateOnFocus: false,
    });

  React.useEffect(() => {
    if (data !== undefined) {
      setChartData(data);
    }
  }, [data]);

  if (!isLoading)
    return (<>
      <ResponsiveHeatMap
        data={chartData}
        // forceSquare={true}
        margin={{ top: 60, right: isMediaNarrow ? 30 : 300, bottom: 60, left: isMediaNarrow ? 30 : 300 }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: '',
          legendOffset: 50
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 70
        }}
        colors={{
          type: 'diverging',
          scheme: 'turbo',
          divergeAt: 0.35,
          minValue: 1,
          maxValue: 16
        }}
        emptyColor="#000"
        legends={[
          {
            anchor: 'bottom',
            // translateX: 260,
            translateY: 40,
            length: 300,
            thickness: 10,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            title: 'Value →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
        inactiveOpacity={0.1}
        theme={{
          "text": {
            "fontSize": 14,
            "fill": "var(--text-color)",
            "outlineWidth": 0,
            "outlineColor": "transparent"
          },
          "tooltip": {
            "container": {
              "background": "#444",
              "fontSize": 14
            },
          }
        }}
      /></>
    )
  else
    return (<p>Loading</p>)
};

export default BandCountByDecadeChart;