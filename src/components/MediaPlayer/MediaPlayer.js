//credits: JOSH COMEU - JOY OF REACT
{/* https://dev.to/lukewduncan/how-to-build-an-audio-player-with-html5-and-the-progress-element-387m */ }
import React from "react";
import { Play, Pause, Volume1, Volume2, VolumeX, AudioLines } from "lucide-react";
import * as classes from './MediaPlayer.module.css';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DeezerContext } from '../DeezerProvider';
import LoaderSvg from '../LoaderSvg'

function MediaPlayer() {
  const { title, cover, artist, src, bandId, trackIsLoading, isPlaying, setIsPlaying, playNextTrack } = React.useContext(DeezerContext)

  const [progressValue, setProgressValue] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [currentTimeFormatted, setCurrentTimeFormatted] = React.useState(0);

  const audioRef = React.useRef();
  const progressBarRef = React.useRef();

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === "Space") {
        setIsPlaying((currentIsPlaying) => {
          return !currentIsPlaying;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    function seek(evt) {
      if (progressBarRef.current && audioRef.current) {
        var percent = evt.offsetX / progressBarRef.current.offsetWidth;
        audioRef.current.currentTime = percent * audioRef.current.duration;
        setProgressValue(percent);
      }
    }

    progressBarRef.current.addEventListener("click", seek);
    return () => {
      progressBarRef.current.removeEventListener("click", seek);
    };
  }, []);

  React.useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (src && audioRef.current.readyState === 0) setIsPlaying(!isPlaying)
  }, [src]);

  React.useEffect(() => {
    const time = Math.round(audioRef.current.currentTime)
    setCurrentTimeFormatted(time < 10 ? `0${time}` : time)
  }, [audioRef.current?.currentTime]);

  function updateProgressBar() {
    if (audioRef.current?.readyState === 4)
      setProgressValue(audioRef.current.currentTime / audioRef.current.duration);
  }

  function changeVolume() {
    switch (volume) {
      case 1:
        audioRef.current.volume = 0.6;
        setVolume(2)
        break;
      case 2:
        audioRef.current.volume = 0;
        setVolume(0)
        break;
      case 0:
        audioRef.current.volume = 0.3;
        setVolume(1)
        break;

      default:
        audioRef.current.volume = 0;
        break;
    }

  }

  return (
    <div className={classes.mediaPlayer} style={{ display: src ? 'block' : 'none' }}>
      <div className={classes.info}>
        <AudioLines />
        <p className="label">Playing preview via deezer api</p>
      </div>

      <div className={classes.mediaPlayerBody} >
        <div className="flex flex-row gap-5">
          {!trackIsLoading ? <img
            width={50}
            height={50}
            src={cover}
          />
            : <LoaderSvg />}
          <div className={classes.summary}>
            <p className="label">{trackIsLoading ? 'loading' : title}</p>
            {!trackIsLoading && <small>{artist}</small>}
          </div>
        </div>
        <div className={classes.controls} >
          <button
            onKeyDown={(event) => {
              if (event.code === "Space") {
                event.stopPropagation();
              }
            }}
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? <Pause /> : <Play />}
            <VisuallyHidden.Root>Toggle playing</VisuallyHidden.Root>
          </button>

          {!!audioRef.current?.duration && <p className="mb-0">00:{currentTimeFormatted} / 00:{Math.round(audioRef.current.duration)}</p>}

          <audio
            onTimeUpdate={updateProgressBar}
            ref={audioRef}
            src={src}
            onEnded={() => {
              setIsPlaying(false);
              playNextTrack();
            }}
          />
          <progress ref={progressBarRef} id="seek-obj" value={progressValue} max="1" />

          <button
            onKeyDown={(event) => {
              if (event.code === "Space") {
                event.stopPropagation();
              }
            }}
            onClick={changeVolume}
          >
            {volume === 1 && <Volume1 />}
            {volume === 2 && <Volume2 />}
            {volume === 0 && <VolumeX />}
            <VisuallyHidden.Root>Change volume</VisuallyHidden.Root>
          </button>
        </div>

      </div>
    </div >
  );
}

export default MediaPlayer;
