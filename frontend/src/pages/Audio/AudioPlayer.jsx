import { useEffect, useRef } from "react";

const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      }
    };
  }, []);

  // Handle source changes
  useEffect(() => {
    if (audioRef.current && url) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }, [url]);

  return (
    <div className="audio-player-container">
      <audio ref={audioRef} controls className="custom-audio">
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
