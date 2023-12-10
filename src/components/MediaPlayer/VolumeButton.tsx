import React from "react";
import {  Volume1, Volume2, VolumeX } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import classes from './MediaPlayer.module.css';

function VolumeButton({}, ref) {
  const [volume, setVolume] = React.useState(1);

  function changeVolume() {
    switch (volume) {
      case 1:
        ref.current.volume = 0.8;
        setVolume(2)
        break;
      case 2:
        ref.current.volume = 0;
        setVolume(0)
        break;
      case 0:
        ref.current.volume = 0.4;
        setVolume(1)
        break;

      default:
        ref.current.volume = 0;
        break;
    }

  }

  return <button
    className={classes.volBtn}
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
}
export default React.forwardRef(VolumeButton)