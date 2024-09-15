import * as React from "react";
import { styled } from "styled-components";

import { filterByDetailsOptions, growFilterOptions } from "../../constants";
import BandCountByContryChart from "../../components/ChartsPage/BandCountByContryChart";
import BandYearsActiveByCountryChart from "../../components/ChartsPage/YearsActiveByCountryChart ";
import BandCountByDecadeChart from "../../components/ChartsPage/BandCountByDecadeChart";
import ActivityInEachDecadeChart from "../../components/ChartsPage/YearsActiveInEachDecadeChart";
import BandYearsActiveChart from "../../components/ChartsPage/YearsActiveChart";
import BandDetailsChart from "../../components/ChartsPage/BandDetailsChart";
import ToogleGroupButton from "../../components/ToogleGroupButton";
import useMatchMedia from "../../helpers/useMatchMedia";
import GenreChart from "../../components/ChartsPage/GenresChart";
import { BandContext } from "../../components/BandsProvider";

function Charts() {
  const [bandStatusFilter, setBandStatusFilter] = React.useState("viewAll");
  const [bandStatus2Filter, setBandStatus2Filter] = React.useState("viewAll");
  const [growlFilter, setGrowlFilter] = React.useState("viewAll");

  const isMediaNarrow = useMatchMedia();

  const { databaseChecked } = React.useContext(BandContext);

  if (!databaseChecked) return <>loading</>;

  return <Wrapper>
    <div>
      <Title>Data visualization</Title>
      <SubTitle>Bands count by country</SubTitle>

      <FilterRow>
        <label>Filter</label>
        <ToogleGroupButton
          list={filterByDetailsOptions}
          currentValue={bandStatusFilter}
          onChange={(val) => setBandStatusFilter(val)}
        />
      </FilterRow>

      <BreakRule />
      <FilterRow>
        <label>Growling intensity</label>
        <ToogleGroupButton
          list={growFilterOptions}
          currentValue={growlFilter}
          onChange={(val) => setGrowlFilter(val)}
        />
      </FilterRow>
    </div>

    <div style={{ height: isMediaNarrow ? "900px" : "450px" }}>
      <BandCountByContryChart
        filter={bandStatusFilter}
        filterGrow={growlFilter}
      />
    </div>
    {/* ---------------------------------- */}

    <div >
      <BreakRule />
      <SubTitle>How many bands are active in each decade</SubTitle>
    </div>

    <div style={{ height: "400px" }}>
      <ActivityInEachDecadeChart />
    </div>

    {/* ---------------- */}
    <div >
      <BreakRule />
      <SubTitle>How long are these bands active</SubTitle>
    </div>

    <div style={{ height: "400px" }}>
      <BandYearsActiveChart />
    </div>

    {/* ---------------------------------- */}
    <div>
      <BreakRule />
      <SubTitle>Genres</SubTitle>
    </div>

    <div>
      <GenreChart />
    </div>

    <div>
      <BreakRule />
      <SubTitle>Other demographics</SubTitle>

      <FilterRow>
        <label>Filter</label>
        <ToogleGroupButton
          list={[
            { value: "viewAll", text: "View All" },
            { value: "active", text: "Active" },
            { value: "disbanded", text: "Disbanded" }
          ]}
          currentValue={bandStatus2Filter}
          onChange={(val) => setBandStatus2Filter(val)}
        />
      </FilterRow>
    </div>

    <div>
      <BandDetailsChart filter={bandStatus2Filter} />
    </div>

    {/* ========================== */}

    <div>
      <BreakRule />
      <SubTitle>How long these bands are active - by country</SubTitle>
    </div>

    <div style={{ height: "800px" }}>
      <BandYearsActiveByCountryChart />
    </div>

    {/* ------------------------------ */}

    <div>
      <BreakRule />
      <SubTitle>
        How many of these bands are active in each decade - by country
      </SubTitle>
    </div>

    <div style={{ height: "700px" }}>
      <BandCountByDecadeChart />
    </div>
  </Wrapper>;
}

export default Charts;

const FilterRow = styled.div`
display: flex;
flex-direction: column;
gap: 4px;
margin: 10px 0px;
@media ${(p) => p.theme.queries.tabletAndUp} {
  flex-direction: row;
  justify-content: center;
  gap: 3px;
  align-items: center;
}
label {
  margin-right: 20px;
  font-weight: bold;
  letter-spacing: .05px;
}
`;

const Wrapper = styled.article`
max-width: 1500px;
text-align: center;
margin: 20px auto;
display: flex;
flex-direction: column;
gap: 20px;
@media ${(p) => p.theme.queries.tabletAndUp} {
  padding: 30px 10%;
  gap: 40px;
  margin: 0px auto;
}
`;

const Title = styled.h2`
line-height: 1.8rem;
font-family: var(--primary-font-family);
font-size: 2rem;
color: var(--text-color);
margin-bottom: 60px;
`;

const SubTitle = styled.h2`
  font-family: var(--secondary-font-family);
  text-transform: uppercase;
  font-size: 0.5em;
  margin-top: 16px;
  font-size: 1rem;
  letter-spacing: .3rem;
  color: var(--text-color);
`;


const BreakRule = styled.hr`
margin: 70px;
color: var(--color-grey-700);
`;

