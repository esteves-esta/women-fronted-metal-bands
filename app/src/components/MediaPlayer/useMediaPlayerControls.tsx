import React from "react";
import { DeezerContext } from '../DeezerProvider';

/* 
credits: 
- https://www.joyofreact.com/
- https://dev.to/lukewduncan/how-to-build-an-audio-player-with-html5-and-the-progress-element-387m
 */

function useMediaPlayerControls( ref ) {
  const { src, isPlaying, setIsPlaying } = React.useContext(DeezerContext)

  const [progressValue, setProgressValue] = React.useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = React.useState<number | string>(0);


  const progressBarRef = React.useRef<HTMLProgressElement>();

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === "Space" && event.target.nodeName !== 'INPUT') {
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
      if (progressBarRef?.current && ref.current) {
        var percent = evt.offsetX / progressBarRef?.current.offsetWidth;
        ref.current.currentTime = percent * ref.current.duration;
        setProgressValue(percent);
      }
    }
    // ussing event like this to access offsetX from event
    progressBarRef.current.addEventListener("click", seek);
    return () => {
      progressBarRef.current.removeEventListener("click", seek);
    };
  }, []);

  React.useEffect(() => {
    ref.current.volume = 0.4;
  }, [])

  React.useEffect(() => {
    let intervalId

    if (isPlaying) {
      // using interval because browser can play song before user interacted with page, 
      // so in that cenario it will set isPlaying to false and not cause error
      intervalId = window.setInterval(async () => {
        try {
          await ref.current.play()
        } catch (e) {
          // console.log({ e })
          setIsPlaying(false)
        }
      }, 300);
    } else {
      ref.current.pause();
    }


    return () => clearTimeout(intervalId);
  }, [isPlaying]);

  React.useEffect(() => {
    if (src && ref.current.readyState === 0) setIsPlaying(!isPlaying)
  }, [src]);

  React.useEffect(() => {
    const time = Math.round(ref.current.currentTime)
    setCurrentTimeFormatted(time < 10 ? `0${time}` : time)
  }, [ref.current?.currentTime]);

  function updateProgressBar() {
    if (ref.current?.readyState === 4)
      setProgressValue(ref.current.currentTime / ref.current.duration);
  }

  return {
    updateProgressBar,
    progressValue,
    currentTimeFormatted,
    progressBarRef
  }
}

export default useMediaPlayerControls;

