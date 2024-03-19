import React from 'react';
import { BandContext } from '../BandsProvider';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import useSWR from "swr";

import useMatchMedia from '../../helpers/useMatchMedia';
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';

function BandYearsActiveByCountryChart() {
  const { databaseChecked } = React.useContext(BandContext)
  const [chartData, setChartData] = React.useState([])
  const isMediaNarrow = useMatchMedia();


  const {
    data,
    isLoading,
  } = useSWR(databaseChecked ? `/years-active-by-country` : null, fetcher, {
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
        margin={{ top: 90, right: isMediaNarrow ? 30 : 300, bottom: 60, left: isMediaNarrow ? 30 : 300 }}
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
          scheme: 'sinebow',
          divergeAt: 0.7,
          minValue: 0,
          maxValue: 15
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
      />
    </>
    )

  else
    return (<React.Fragment>
      <div className="flex flex-row gap-4 justify-center items-center">
        <p>Loading </p>
        <LoaderSvg width={50} height={50} />
      </div>
    </React.Fragment>)
};

export default BandYearsActiveByCountryChart;