import React from "react";
import { styled } from "styled-components";
import {
  AudioLines,
  PlayCircle,
  PauseCircle,
  Play,
  ListMusic,
  Heart,
  Volume1,
  Volume2,
  VolumeX
} from "lucide-react";
import { DeezerContext } from "../DeezerProvider";
import UserListModal from "../UserListModal";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { BandContext } from "../BandsProvider";
import useMediaPlayerControls from "./useMediaPlayerControls";
import { sample } from "../../helpers/range";

function MediaPlayer() {
  const audioRef = React.useRef<HTMLAudioElement>();
  const { src, isPlaying, setIsPlaying, playNextTrack } =
    React.useContext(DeezerContext);
  const {
    updateProgressBar,
    progressValue,
    currentTimeFormatted,
    progressBarRef
  } = useMediaPlayerControls(audioRef);

  const { title, cover, getTrackPreview, artist, trackIsLoading, deezerTrackInfo } =
    React.useContext(DeezerContext);
  const { saveTrackToUserList, bands } = React.useContext(BandContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const { userLikedTracksList } = React.useContext(BandContext);
  const total = userLikedTracksList.length;

  const ICON_SIZE = 17;

  const playRandom = () => {
    const randomBand = sample(
      bands.filter(
        (item) => item.deezerId != null || item.deezerRecommendationId != null
      )
    );
    // console.log({ randomBand })
    getTrackPreview(randomBand.deezerId);
  };

  return (
    <PlayerWrapper>
      <Progress ref={progressBarRef} value={progressValue} max="1" />
      <audio
        onTimeUpdate={updateProgressBar}
        ref={audioRef}
        src={src}
        onEnded={() => {
          setIsPlaying(false);
          playNextTrack();
        }}
      />

      <PlayerBody>
        <Btn
          onKeyDown={(event) => {
            if (event.code === "Space") {
              event.stopPropagation();
            }
          }}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? (
            <PauseCircle size={ICON_SIZE} />
          ) : (
            <PlayCircle size={ICON_SIZE} />
          )}
          <VisuallyHidden.Root>Toggle playing</VisuallyHidden.Root>
        </Btn>

        {!!audioRef.current?.duration && (
          <p className="mb-0 font-bold">
            00:{currentTimeFormatted}
            {/* / 00:{Math.round(ref.current.duration)} */}
          </p>
        )}

        {!trackIsLoading && (
          <Btn onClick={() => saveTrackToUserList(deezerTrackInfo)}>
            <Heart size={ICON_SIZE} />
            <VisuallyHidden.Root>Save track on liked list</VisuallyHidden.Root>
          </Btn>
        )}

        <TrackInfo>
          <Title>{trackIsLoading ? "loading" : title}</Title>
          {!trackIsLoading && (
            <p>
              <span>BY </span>
              {artist}
            </p>
          )}
        </TrackInfo>

        <Btn onClick={playRandom}>
          <Play size={ICON_SIZE} />
          <span>random</span>
        </Btn>

        <Btn onClick={() => setIsOpen(true)}>
          <ListMusic size={ICON_SIZE} />
          <span>favorites</span>
        </Btn>

        <UserListModal isOpen={isOpen} handleOpen={setIsOpen} />

        <ApiInfo>
          <AudioLines size={ICON_SIZE} />
          <span>preview via</span>
          <a href="https://developers.deezer.com/api" target="_blank">
            deezer api
          </a>
        </ApiInfo>

        <VolumeBtn size={ICON_SIZE} ref={audioRef} />
      </PlayerBody>
    </PlayerWrapper>
  );
}

function VolumeButton({ size }, ref) {
  const [volume, setVolume] = React.useState(1);

  function changeVolume() {
    switch (volume) {
      case 1:
        ref.current.volume = 0.8;
        setVolume(2);
        break;
      case 2:
        ref.current.volume = 0;
        setVolume(0);
        break;
      case 0:
        ref.current.volume = 0.4;
        setVolume(1);
        break;

      default:
        ref.current.volume = 0;
        break;
    }
  }

  return (
    <Btn
      onKeyDown={(event) => {
        if (event.code === "Space") {
          event.stopPropagation();
        }
      }}
      onClick={changeVolume}
    >
      {volume === 1 && <Volume1 size={size} />}
      {volume === 2 && <Volume2 size={size} />}
      {volume === 0 && <VolumeX size={size} />}
      <VisuallyHidden.Root>Change volume</VisuallyHidden.Root>
    </Btn>
  );
}

const VolumeBtn = React.forwardRef(VolumeButton);

const PlayerWrapper = styled.div`
  isolation: isolate;
  z-index: 1;
  position: sticky;
  left: 0px;
  font-size: 0.8rem;
  top: 0px;
  width: 100%;
  background-color: var(--color-secondary);
  display: flex;
  flex-direction: column;
  @media ${(p) => p.theme.queries.tabletAndUp} {
    max-height: 42px;
  }
`;

const ApiInfo = styled.div`
  display: none;
  a {
    transition: color 500ms ease-in-out;
    color: var(--color-primary);
    text-underline-offset: 4px;
  }
  @media ${(p) => p.theme.queries.tabletAndUp} {
    gap: 5px;
    align-items: center;
    display: flex;
  }

  @media (hover: hover) and (pointer: fine) {
    a:hover {
      color: var(--color-primary-light);
    }
  }
`;

const Btn = styled.button`
  /* TODO - simple animation */
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 500ms ease-in-out;
  cursor: pointer;
  span {
    display: none;
  }
  @media ${(p) => p.theme.queries.tabletAndUp} {
    span {
      display: revert;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-primary-light);
    }
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  gap: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07rem;
  span {
    font-weight: normal;
  }
  @media ${(p) => p.theme.queries.tabletAndUp} {
    flex: 1 0 auto;
  }
`;

const PlayerBody = styled.div`
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  button {
    background: transparent;
    color: white;
    border: none;
  }
  @media ${(p) => p.theme.queries.tabletAndUp} {
    justify-content: space-between;
    flex: 1 0 auto;
    gap: 15px;
  }
`;

const Progress = styled.progress`
  width: 100%;
  height: 10px;
  background-color: var(--color-secondary-dark);
  cursor: pointer;
  border: none;
  &::-webkit-progress-bar {
    background-color: var(--color-primary-dark);
  }

  &::-webkit-progress-value {
    background-color: var(--color-primary-dark);
  }

  &::-moz-progress-bar {
    background-color: var(--color-primary-dark);
  }
`;

const Title = styled.p``;

export default MediaPlayer;
