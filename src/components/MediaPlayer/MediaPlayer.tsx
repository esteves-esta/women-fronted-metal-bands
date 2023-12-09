import React from "react";
import {  AudioLines } from "lucide-react";
import { DeezerContext } from '../DeezerProvider';
import LoaderSvg from '../LoaderSvg'
import MediaPlayerControls from "./MediaPlayerControls";
import VolumeButton from "./VolumeButton";
import classes from './MediaPlayer.module.css';

function MediaPlayer() {
  const { src } = React.useContext(DeezerContext)
  const audioRef = React.useRef<HTMLAudioElement>();
  return (
    <div className={classes.mediaPlayer} style={{ display: src ? 'block' : 'none' }}>
      <MediaPlayerTopBar />

      <div className={classes.mediaPlayerBody} >
        <MediaPlayerSummary />

        <MediaPlayerControls ref={audioRef} />

        <VolumeButton ref={audioRef} />
      </div>
    </div >
  );
}

function MediaPlayerSummary() {
  const { title, cover, artist, trackIsLoading } = React.useContext(DeezerContext)

  return <div className="flex flex-row gap-5">
    {!trackIsLoading ? <img
      width={50}
      height={50}
      src={cover}
    />
      : <LoaderSvg />}
    <div className={classes.summary}>
      <p className={classes.title}>{trackIsLoading ? 'loading' : title}</p>
      {!trackIsLoading && <small>{artist}</small>}
    </div>
  </div>
}

function MediaPlayerTopBar() {
  return <div className={classes.info}>
    <div className="flex flex-row gap-4 items-center">
      <AudioLines />
      <p className="label mb-0">Playing preview via
        <a className="inline pl-2" href="https://developers.deezer.com/api" target="_blank">deezer api</a></p>

    </div>
  </div>
}

export default MediaPlayer;
