import * as React from "react";
import { styled } from "styled-components";
import { growTagList } from "../../constants";
import { Band } from "../../models/Band";
import Tag from "../Tag";

interface GridProps {
  bands: Band[];
}

function BandGrid({ bands }: GridProps) {
  return (
    <GridWrapper>
      {bands.map((band, index) => (
        <Card key={band.id}>
          <CardImage band={band} />

          <Title className={index === 0 ? "listing" : ""}>
            <p>{band.band}</p>
          </Title>
          <InfoWrapper>
            <Tag $hue="purple" $intensity={band.growling}>
              {growTagList.find((tag) => tag.value === band.growling).text}
            </Tag>

            <Tag $hue="cyan" $intensity={1}>
              {!!band.yearEnded ? "Active" : "Disbanded"}
            </Tag>
            {/* <MoreInfoWrapper>
              <Tag $hue="cyan" $intensity={1}>
                {!!band.yearEnded ? "Active" : "Disbanded"}
              </Tag>
              <Tag $hue="cyan" $intensity={1}>
                {!!band.yearEnded ? "Active" : "Disbanded"}
              </Tag>
            </MoreInfoWrapper> */}
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
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  font-size: calc(12rem / 16);
  border-bottom: 0.05rem solid var(--color-secondary-alpha-300);
  &.listing {
    border-bottom: 0px;
    background-color: var(--color-tertiary);
  }
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
  position: relative;
  height: 300px;
  border: 0.15rem solid var(--color-secondary-alpha-300);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media ${(p) => p.theme.queries.tabletAndUp} {
  }

  img,
  ${ImgPlaceholder} {
    height: 200px;
    /* height: clamp(10%, 70%, 220px); */
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

const MoreInfoWrapper = styled.div`
  background: blue;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  /* flex: 1; */
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px 10px;
  flex: 1;
  /* gap: 15px; */

  ${Card}:hover & > ${MoreInfoWrapper} {
    background: red;
  }
`;

const ActionBtn = styled.button`
  width: 100%;
  background: var(--color-primary-alpha-500);
  color: var(--text-color);
  border: none;
  text-align: left;
  padding: 5px 10px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: calc(0.4rem / 16);
  cursor: pointer;
  flex: 0;
  opacity: 0;

  position: relative;
  bottom: 0px;
  transform: translateY(40px);
  transition: opacity 450ms ease-in-out 20ms, transform 40ms 700ms;

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0px);
    transition: opacity 550ms ease-in-out 200ms, transform 50ms;
  }

  @media (hover: hover) and (pointer: fine) {
  }
`;

export default BandGrid;
