import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import LoaderSvg from '../LoaderSvg';
import styled from 'styled-components';
import classes from './ChartsPage.module.css'
import { useLiveQuery } from "dexie-react-hooks";
import { getDetails } from '../../database/charts'

function BandDetailsChart({ filter }) {
  const [isLoading, setIsLoading] = React.useState(true)

  const [chartDetails, setChartDetails] = React.useState({
    allwomenData:
      [{ id: "all women", value: 0 }, { id: "mixed", value: 0 }],
    blackwomenData: [{ id: "other", value: 0 }, { id: "black women", value: 0 }],
    sisterData: [{ id: "yes", value: 0 }, { id: "no", value: 0 }],
    statusData: [{ id: "active", value: 0 }, { id: "disbanded", value: 0 }]
  });

  const data = useLiveQuery(() => {
    setIsLoading(true);
    return getDetails(filter)
  }, [filter]);

  React.useEffect(() => {
    if (data !== undefined) {
      setChartDetails(data);
    }
    setIsLoading(false);
  }, [data]);

  // return (<React.Fragment>
  //   <div className="flex flex-row gap-4 justify-center items-center">
  //     <p>Loading </p>

  //   </div>
  // </React.Fragment>)

  return (
    <Wrapper>
      <Row className="borderBottom">
        <Col className="borderRight">
          {!isLoading && <PieChartCustom colors={{ scheme: 'purpleRed_green' }} data={chartDetails.allwomenData} />}
          {isLoading && <LoaderWrapper>
            <LoaderSvg width={50} height={50} />
          </LoaderWrapper>}
          <small>
            All women band
          </small>
        </Col>
        <Col className='flex flex-col pb-4'>
          {!isLoading && <PieChartCustom colors={{ scheme: 'pink_yellowGreen' }} data={chartDetails.blackwomenData} />}
          {isLoading && <LoaderWrapper>
            <LoaderSvg width={50} height={50} />
          </LoaderWrapper>}
          <small>
            Black women
          </small>
        </Col>
      </Row>

      <Row>
        <Col className="borderRight">
          {!isLoading && <PieChartCustom colors={{ scheme: 'category10' }} data={chartDetails.sisterData} />}
          {isLoading && <LoaderWrapper>
            <LoaderSvg width={50} height={50} />
          </LoaderWrapper>}
          <small>
            Sisters
          </small>
        </Col>
        <Col>
          {!isLoading && <PieChartCustom colors={{ scheme: 'paired' }} data={chartDetails.statusData} />}
          {isLoading && <LoaderWrapper>
            <LoaderSvg width={50} height={50} />
          </LoaderWrapper>}
          <small>
            Band status
          </small>
        </Col>
      </Row>
    </Wrapper >
  )

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

const Wrapper = styled.div`
/* @media ${(p) => p.theme.queries.tabletAndUp} { */

 .borderRight{
   border-right: 1px solid var(--border-color);
 }
 .borderBottom{
   border-bottom: 1px solid var(--border-color);
 }

 @media screen and (min-width: 640px) and (max-width: 768px) {
  .borderRight,
  .borderBottom {
    border: none
  }
}

@media screen and (min-width: 0px) and (max-width: 640px) {
  .borderRight,
  .borderBottom {
    border: none
  }
}
`;

const Row = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-top: 5px;
@media ${(p) => p.theme.queries.tabletAndUp} {
  flex-direction: row;
}
`;


const Col = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding-bottom: 10px;
small {
  text-align: center;
  color: var(--text-title);
  // font-family: 'Rubik Glitch', cursive;
  font-family: 'Lexend Peta', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: .8rem;
}
`;


const LoaderWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 350px;
height: 350px;
`;
