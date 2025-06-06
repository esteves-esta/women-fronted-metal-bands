import React from 'react';
import { ResponsiveBar } from '@nivo/bar'

import useMatchMedia from '../../helpers/useMatchMedia';
import ChartLoader from './ChartLoader';
import styled from 'styled-components';
import { useLiveQuery } from "dexie-react-hooks";
import { getBandsActive } from '../../database/charts'


function BandYearsActiveChart() {
  const [isLoading, setIsLoading] = React.useState(true)

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

  const data = useLiveQuery(() => {
    setIsLoading(true);
    return getBandsActive()
  }, []);


  React.useEffect(() => {
    if (data !== undefined) {
      setChartData(data.chartData);
      setAverageTime(data.average);
    }
    setIsLoading(false);
  }, [data]);


  const isMediaNarrow = useMatchMedia();

  if (!isLoading)
    return (
      <React.Fragment>
        <Wrapper>
          <p >
            Average time of activity: {" "}
            <span>{averageTime} years</span>
          </p>
        </Wrapper>
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
  else return (<ChartLoader />)
};
const Wrapper = styled.div`
p {
  text-align: center;
  margin-top: 10px;
  color: var(--text-title);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 1rem;
}
span {
  color: white;
}
`;


export default BandYearsActiveChart;
