import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap'
import ChartLoader from './ChartLoader';
import { useLiveQuery } from "dexie-react-hooks";
import { getActiveByCountry } from '../../database/charts'
import useMatchMedia from '../../helpers/useMatchMedia';

function BandYearsActiveByCountryChart() {
  const [chartData, setChartData] = React.useState([])
  const isMediaNarrow = useMatchMedia();
  const [isLoading, setIsLoading] = React.useState(true)

  const data = useLiveQuery(() => {
    setIsLoading(true);
    return getActiveByCountry()
  });


  React.useEffect(() => {
    if (data !== undefined) {
      setChartData(data);
    }
    setIsLoading(false);
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

  else return (<ChartLoader />)
};

export default BandYearsActiveByCountryChart;
