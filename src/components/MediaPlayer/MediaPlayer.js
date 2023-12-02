//credits: JOSH COMEU - JOU OF REACT
import React from "react";
import { Play, Pause } from "lucide-react";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

function MediaPlayer({ src }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const audioRef = React.useRef();

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
    if (isPlaying) {
      
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="wrapper">
      <div className="media-player">
        <img
          alt=""
          src="https://sandpack-bundler.vercel.app/img/take-it-easy.png"
        />
        <div className="summary">
          <h2>Take It Easy</h2>
          <p>Bvrnout ft. Mia Vaile</p>
        </div>
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
        asdf
        <audio
          controls
          ref={audioRef}
          src={src}
          onEnded={() => {
            setIsPlaying(false);
          }}
        />
        {/* https://dev.to/lukewduncan/how-to-build-an-audio-player-with-html5-and-the-progress-element-387m */}
        <progress id="seek-obj" value="0.3" max="1"></progress>
      </div>
    </div>
  );
}

export default MediaPlayer;
