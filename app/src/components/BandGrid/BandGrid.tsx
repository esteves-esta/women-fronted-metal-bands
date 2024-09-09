import * as React from 'react';
import { BandContext } from "../../components/BandsProvider";
import { styled } from "styled-components";
import { growTagList } from '../../constants'
function BandGrid() {
  const {
    bands
  } = React.useContext(BandContext);
// TODO - have prop to receive band info
  return (<Wrapper>
    {bands.map((band) => (
      <Card key={band.id} >
        {band.deezerPicture && <img src={band.deezerPicture} alt={band.band} />}
        {
          !band.deezerPicture && <ImgPlaceholder><div>{band.band}</div></ImgPlaceholder>}
        <p>

          {band.band}
        </p>

        <InfoWrapper>

          <Tag hue="primary" intensity={band.growling}>
            {growTagList.find(tag => tag.value === band.growling).text}
          </Tag>

          <Tag hue="secondary" intensity={1}>
            {!!band.yearEnded ? 'Active' : 'Disbanded'}
          </Tag>
        </InfoWrapper>
      </Card>
    ))}
  </Wrapper>);
}

type Props = React.ComponentProps<"div"> & {
  hue: 'primary' | 'secondary' | 'tertiary',
  intensity: 0 | 1 | 2 | 3;
  children: any;
}

function Tag({ children, ...props }: Props) {
  return <TagWrapper {...props}>
    {children}
  </TagWrapper>
}


const Wrapper = styled.div`
display: grid;
grid-template-columns:repeat(6, 1fr);
grid-gap: 20px;

@media (hover: hover) and (pointer: fine) {
}

@media ${p => p.theme.queries.tabletAndUp} {}
`;

const Card = styled.div`
border: 1px solid black;
height: 300px;
img {
  height: 70%;
  width: 100%;
  object-fit: cover;
  object-position: 0px 20%;

  background-size: contain;
}
`;

const ImgPlaceholder = styled.div`
background: radial-gradient(71.14% 84.14% at 50% 49.75%, #51065E 0%, #2C0732 44%, #000 100%), #FFF;
height: clamp(30px, 70%, 200px);
overflow: hidden;
div {
  color: hsla(0deg 0% 40% / 83%);
  mix-blend-mode: color-dodge;
  font-family: "Unna", serif;
  text-transform: lowercase;
  font-weight: 700;
  font-size: 8.5rem;
  letter-spacing: -.3rem;
  line-height: .5;
  word-break: break-all;
  width: 210px;
}
`;

const TagWrapper = styled.div<Props>`
background: var(--${p => p.hue === 'primary' ? 'color-primary' : 'color-info'}) ;
padding: 4px 12px;
border-radius: 1rem;
`;
const InfoWrapper = styled.div`
display: flex;
flex-wrap: wrap;
`;

export default BandGrid;
