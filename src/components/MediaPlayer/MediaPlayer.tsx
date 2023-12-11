import React from "react";
import { AudioLines } from "lucide-react";
import { DeezerContext } from '../DeezerProvider';
import LoaderSvg from '../LoaderSvg'
import MediaPlayerControls from "./MediaPlayerControls";
import VolumeButton from "./VolumeButton";
import classes from './MediaPlayer.module.css';
import UserListModal from '../UserListModal'
import { ListMusic, Heart } from 'lucide-react';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { BandContext } from "../BandsProvider";

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
  const { title, cover, artist, trackIsLoading, deezerTrackInfo } = React.useContext(DeezerContext)
  const { saveTrackToUserList } = React.useContext(BandContext)

  return <div className="flex flex-row gap-5 items-center">
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

    {!trackIsLoading && <button
      onClick={() => saveTrackToUserList(deezerTrackInfo)}
      className="clearButton">
      <Heart size={21} />
      <VisuallyHidden.Root>Save track on liked list</VisuallyHidden.Root>
    </button>}
  </div>
}

function MediaPlayerTopBar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { userLikedTracksList } = React.useContext(BandContext)
  const total = userLikedTracksList.length
  return <>
    <div className={classes.info}>
      <div className="flex flex-row gap-4 items-center">
        <AudioLines />
        <p className="label mb-0">Playing preview via
          <a className="inline pl-2" href="https://developers.deezer.com/api" target="_blank">deezer api</a></p>

      </div>

      <button className="clearButton" onClick={() => setIsOpen(true)}>
        <ListMusic size={21} />
        your list of favorites: <strong>{total} {total > 1 ? 'songs' : 'song'}</strong>
      </button>
    </div>
    <UserListModal isOpen={isOpen} handleOpen={setIsOpen} />
  </>
}

export default MediaPlayer;
