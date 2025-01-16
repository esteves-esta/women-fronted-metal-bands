import React from 'react';
import { BandContext } from '../BandsProvider';
import classes from './ChartsPage.module.css'
import useSWR from "swr";
import { errorRetry, fetcher } from './apiFunctions';
import LoaderSvg from '../LoaderSvg';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { styled } from "styled-components";

export interface WordData {
  text: string;
  value: number;
}

function GenreChart() {
  const { databaseChecked } = React.useContext(BandContext)
  const [chartDetails, setChartDetails] = React.useState([]);



  const { data, isLoading } = useSWR(
    databaseChecked ? `/genre` : null,
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


  return (
    <Wrapper>
      {isLoading && <LoaderWrapper>
        <LoaderSvg width={50} height={50} />
      </LoaderWrapper>}
      {/* {chartDetails.length} */}
      {!isLoading && data.length > 0 && <ParentSize>
        {({ width }) => <WordCloundCustom data={chartDetails} width={width} />}
      </ParentSize>}

    </Wrapper>
  )

};

function WordCloundCustom({ data, width }) {
  const fontScale = scaleLog({
    domain: [Math.min(...data.map((w) => w.value)), Math.max(...data.map((w) => w.value))],
    range: [20, 100],
  });

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  // https://d3js.org/d3-scale-chromatic/sequential

  // const colors = [
  //   "#a50026",
  //   "#d73027",
  //   "#f46d43",
  //   "#fdae61",
  //   "#fee090",
  //   "#ffffbf",
  //   "#e0f3f8",
  //   "#abd9e9",
  //   "#74add1",
  //   "#4575b4",
  //   "#313695",
  // ];

  const colors = [
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
  ]

  // const colors = [
  //   "#7f3b08",
  //   "#b35806",
  //   "#e08214",
  //   "#fdb863",
  //   "#fee0b6",
  //   "#f7f7f7",
  //   "#d8daeb",
  //   "#b2abd2",
  //   "#8073ac",
  //   "#542788",
  //   "#2d004b",
  // ]

  return (
    <div className={classes.wordcloud}>
      <Wordcloud
        words={data}
        width={width}
        height={400}
        fontSize={fontSizeSetter}
        font={'Cinzel'}
        padding={2}
        spiral={'archimedean'}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>);
}

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
@media ${(p) => p.theme.queries.tabletAndUp} {
  flex-direction: row;
}
`;

const LoaderWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
width: 350px;
 height: 350px;
@media ${(p) => p.theme.queries.tabletAndUp} {
flex-direction: row;
}
`;

export default GenreChart;