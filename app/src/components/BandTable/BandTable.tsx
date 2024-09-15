import * as React from "react";
import { BandContext } from "../../components/BandsProvider";
import { Band } from "../../models/Band";
import { styled } from "styled-components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { growTagList } from "../../constants";
import Tag from "../Tag";

interface GridProps {
  bands: Band[];
}

function BandTable({ bands }: GridProps) {

  return (
    <Wrapper>
      <Table>
        <Header>
          <tr >
            <td>
              Band
            </td>

            <td>
              <VisuallyHidden>Status</VisuallyHidden>
            </td>

            <td>
              <VisuallyHidden>Growling</VisuallyHidden>
            </td>
            <td>
              Country
            </td>
            <td>
              Genres
            </td>
            <td>
              Vocalist(s)
            </td>
            <td>
              All women
            </td>
            <td>
              Years active
            </td>
            <td>
              Activity
            </td>
          </tr>
        </Header>

        <tbody>
          {bands.map((band) => (
            <Row key={band.id}>
              <td>
                {band.band}
              </td>

              <CellFixedWidth>
                <Tag $hue={!!band.yearEnded ? 'cyan' : 'black'} $intensity={1} $circle={true}>
                  {!!band.yearEnded ? 'Active' : 'Disbanded'}
                </Tag>
              </CellFixedWidth>

              <CellFixedWidth>
                <Tag $hue="purple" $intensity={band.growling} $circle={true}>
                  {growTagList.find((tag) => tag.value === band.growling).text}
                </Tag>
              </CellFixedWidth>

              <td>
                {band.country}
              </td>

              <CellOverflowHidden>
                {band.genre.length > 0 ? band.genre[0] : '-'}
              </CellOverflowHidden>

              <CellOverflowHidden>
                {band.currentVocalists.join(', ')}
              </CellOverflowHidden>

              <CellFixedWidth>
                <Tag $hue={band.allWomenBand ? 'blue' : 'black'} $intensity={0} $circle={true}>
                  {band.allWomenBand ? 'Yes' : 'No'}
                </Tag>
              </CellFixedWidth>
              <td>
                {band.yearStarted} {band.yearEnded !== 0 ? `- ${band.yearEnded}` : '- now'}
              </td>

              <td>
                {band.activeFor} year{band.activeFor > 1 ? 's' : ''}
              </td>
            </Row>
          ))}

        </tbody>

      </Table>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  /*
   min-width: 800px;
   max-width: 1400px; 
   */
   /* width: 800px; */
  overflow-x: auto;
`;

const Header = styled.thead`
font-weight: bold;
font-size: calc(13rem / 16);
letter-spacing: calc(.5rem / 16);
text-align: center;
color: var( --color-grey-500);
`;



const Row = styled.tr`
transition: all 350ms ease-in;
background-color: var(--color-secondary-dark-alpha-700);

&:hover {
  background-color: var(--color-primary-dark);
}

td {
  width: 3%;
  text-align: center;
  padding: 0px 15px;
  height: 82px;
  vertical-align: middle;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: calc(.4rem / 16);
  line-height: calc(21rem / 16);
}
td:first-of-type{
  padding-left:4%;
  min-width: 100px;
}
`;

const CellFixedWidth = styled.td`
  min-width: 58px !important; 
  max-width: 58px !important; 
`;
const CellOverflowHidden = styled.td`
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
width: 120px;
max-width: 120px;
transition: height 350ms ease-in;
${Row}:hover & {
  white-space: break-spaces;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 100px;
}
`;

const Table = styled.table`
  border-spacing: 0px 10px;
`

export default BandTable;
