import * as React from "react";
import { Band } from "../../models/Band";
import { styled } from "styled-components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { growTagList } from "../../constants";
import Tag from "../Tag";
import {
  AudioLines,
  Play,
  ExternalLink
} from "lucide-react";
interface GridProps {
  bands: Band[];
}
import { DeezerContext } from "../DeezerProvider";

function BandTable({ bands }: GridProps) {
  const ICON_SIZE = 20;
  const { playRecommendedTrackOrOpenLink } = React.useContext(DeezerContext);

  return (
    <Wrapper>
      <Table>
        <Header>
          <tr >
            <th>
              Band
            </th>

            <th>
              <VisuallyHidden>Status</VisuallyHidden>
            </th>

            <th>
              <VisuallyHidden>Growling</VisuallyHidden>
            </th>
            <th>
              Country
            </th>
            <th>
              Genres
            </th>
            <th>
              Vocalist(s)
            </th>
            <th>
              All women
            </th>
            <th>
              Years active
            </th>
            <th>
              Activity
            </th>
          </tr>
        </Header>

        <tbody>
          {bands.map((band) => (
            <Row key={band.id} className={band.selected ? "listening" : ""}>
              <td>
                <BandNameWrapper>

                  {band.band}
                  {band.selected && <AudioLines size={ICON_SIZE} />}
                  {!band.selected && <OnHoverWrapper>
                    <Btn onClick={() => playRecommendedTrackOrOpenLink(band)}>
                      {band.deezerId || band.deezerRecommendationId ? <Play size={ICON_SIZE} /> :
                        <ExternalLink size={ICON_SIZE} />}
                    </Btn>
                  </OnHoverWrapper>}
                </BandNameWrapper>
              </td>

              <td>
                <CellFixedWidth>
                  <Tag $hue={!band.yearEnded ? 'cyan' : 'black'} $intensity={1} $circle={true}>
                    {!band.yearEnded ? 'Active' : 'Ended'}
                  </Tag>
                </CellFixedWidth>
              </td>

              <td>
                <CellFixedWidth>
                  <Tag $hue="purple" $intensity={band.growling} $circle={true}>
                    {growTagList.find((tag) => tag.value === band.growling).text}
                  </Tag>
                </CellFixedWidth>
              </td>

              <td>
                {band.countryCode}
              </td>

              <CellOverflowHidden>
                {band.genre.length > 0 ? band.genre[0] : '-'}
              </CellOverflowHidden>

              <CellOverflowHidden>
                {band.currentVocalists.join(', ')}
              </CellOverflowHidden>

              <td>
                <CellFixedWidth>
                  <Tag $hue={band.allWomenBand ? 'blue' : 'black'} $intensity={0} $circle={true}>
                    {band.allWomenBand ? 'Yes' : 'No'}
                  </Tag>
                </CellFixedWidth>
              </td>

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
  position: relative;
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
&.listening {
  background-color: var(--color-tertiary);
}
&:not(.listening):hover {
  background-color: var(--color-primary-dark);
}

td {
  width: 3%;
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

const CellFixedWidth = styled.div`
display: flex;
justify-content: center;
min-width: 60px !important; 
max-width: 60px !important; 
`;

const CellOverflowHidden = styled.td`
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
width: 120px;
max-width: 120px;
transition: height 350ms ease-in;
@media (hover: hover) and (pointer: fine) {
  
   ${Row}:hover & {
     white-space: break-spaces;
     text-overflow: ellipsis;
     overflow: hidden;
     height: 100px;
    }
}
`;

const Table = styled.table`
  border-spacing: 0px 10px;
`

const BandNameWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
    text-align: left;
`
const OnHoverWrapper = styled.div`
  opacity: 0;
  user-select: none;
  transition: opacity 650ms ease-in;
  @media (hover: hover) and (pointer: fine) {
    
    ${Row}:hover & {
     white-space: break-spaces;
     opacity: 1;
    }
  }
  `;

const Btn = styled.button`
 display: flex;
 align-items: center;
 background: transparent;
 border: none;
 cursor: pointer;
 color: inherit;
 padding: 10px;
 border-radius: 100rem;
 transition: background 450ms ease-in;
 @media (hover: hover) and (pointer: fine) {
  &:hover {
    background: var(--color-primary-alpha-500);
  }
}
 `;

export default BandTable;
