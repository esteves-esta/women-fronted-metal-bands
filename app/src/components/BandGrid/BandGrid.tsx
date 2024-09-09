import * as React from "react";
import { styled } from "styled-components";
import { growTagList } from "../../constants";
import { Band, Tntensity } from "../../models/Band";

interface GridProps {
  bands: Band[];
}

function BandGrid({ bands }: GridProps) {
  return (
    <GridWrapper>
      {bands.map((band) => (
        <Card key={band.id}>
          <CardImage band={band} />

          <Title>
            <p>{band.band}</p>
          </Title>
          <InfoWrapper>
            <Tag $hue="purple" $intensity={band.growling}>
              {growTagList.find((tag) => tag.value === band.growling).text}
            </Tag>

            <Tag $hue="cyan" $intensity={1}>
              {!!band.yearEnded ? "Active" : "Disbanded"}
            </Tag>
          </InfoWrapper>
          <ActionBtn>Play</ActionBtn>
        </Card>
      ))}
    </GridWrapper>
  );
}

function CardImage({ band }: { band: Band }) {
  if (band.deezerPicture && !band.emptyPicture) {
    return <img src={band.deezerPicture} alt="Picture of the band" />;
  }
  if (!!band.deezerTrackInfo && band.emptyPicture) {
    return (
      <img
        src={band.deezerTrackInfo && band.deezerTrackInfo.album.cover_medium}
        alt="Picture of the band"
      />
    );
  }

  return (
    <ImgPlaceholder>
      <div>{band.band}</div>
    </ImgPlaceholder>
  );
}

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (hover: hover) and (pointer: fine) {
  }

  @media ${(p) => p.theme.queries.tabletAndUp} {
    grid-template-columns: repeat(6, 1fr);
    /* grid-template-rows: 300px; */
    grid-gap: 20px;
  }
`;

const Title = styled.div`
  text-align: center;
  padding: 5px;
  background-color: var(--color-primary-alpha-300);
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* align-items: center; */
  padding: 15px 10px;
  flex: 1;
`;

const ImgPlaceholder = styled.div`
  user-select: none;
  background: radial-gradient(
      71.14% 84.14% at 50% 49.75%,
      hsl(291, 87%, 19%) 0%,
      hsl(291, 75%, 11%) 44%,
      hsl(0, 0%, 0%) 100%
    ),
    hsl(0, 0%, 100%);
  color: var(--text-color-alpha-8);
  font-family: "Unna", serif;
  text-transform: lowercase;
  font-weight: 700;
  font-size: 8.5rem;
  letter-spacing: -0.3rem;
  line-height: 0.5;
  word-break: break-all;

  div {
    overflow: hidden;
    height: 100%;
    mix-blend-mode: color-dodge;
  }
`;

const Card = styled.div`
  height: 300px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
  @media ${(p) => p.theme.queries.tabletAndUp} {
  }

  img,
  ${ImgPlaceholder} {
    /* height: 70%; */
    height: clamp(30px, 70%, 200px);
    width: 100%;
    object-fit: cover;
    object-position: 0px 10%;
    background-size: contain;
    transition: height 350ms ease-in-out;
  }

  &:hover {
    img,
    ${ImgPlaceholder} {
      height: 10%;
      transition: height 450ms ease-in-out;
    }
  }
`;

const ActionBtn = styled.button`
  width: 100%;
  background: var(--color-primary);
  color: var(--text-color);
  border: none;
  align-self: end;

  cursor: pointer;
  opacity: 0;
  /* height: 1px; */
  overflow: hidden;
  transition: all 450ms ease-in-out 20ms;

  ${Card}:hover & {
    /* height: fit-content; */
    opacity: 1;
    align-self: end;
    transition: all 550ms ease-in-out 200ms;
  }

  @media (hover: hover) and (pointer: fine) {
  }
`;

// -------------------
type TagHues = "purple" | "green" | "blue" | "yellow" | "red" | "cyan";

type Props = React.ComponentProps<"div"> & {
  $hue: TagHues;
  $intensity: Tntensity;
  children: any;
};

function Tag({ children, ...props }: Props) {
  return <TagWrapper {...props}>{children}</TagWrapper>;
}

const TagWrapper = styled.div.attrs<Props>((p) => ({
  $hue: p.$hue,
  $intensity: p.$intensity
}))`
  background: hsl(
    var(--${(p) => p.$hue}) var(--intensity-${(p) => p.$intensity})
  );
  padding: 2px 12px;
  border-radius: 1rem;
  height: fit-content;
  font-size: calc(13rem / 16);
  letter-spacing: 0.05rem;
`;

// -------------------

export default BandGrid;
