import React, { useEffect, useRef, useState } from "react";

const NowPlayingCard = ({ song }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.pause(); // Pause any playing audio
          audioRef.current.load(); // Reload the new song
          await audioRef.current.play(); // Play the new song
        } catch (error) {
          console.error("Audio playback error:", error);
        }
      }
    };

    playAudio();

    // Update duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current?.duration || 0);
    };

    // Update current time dynamically
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
    };

    // Add event listeners
    audioRef.current?.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      // Cleanup event listeners
      audioRef.current?.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  return (
    <div className="now-playing-card">
      <h4 className="now-playing-title">Now Playing</h4>
      <img
        src={song.image}
        alt={song.title}
        className="now-playing-image"
        style={{ width: "220px", height: "120px", borderRadius: "10px" }}
      />
      <div className="song-info">
        <h4>{song.title}</h4>
        <p>{song.album}</p>
      </div>
      <div className="progress-bar">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const newTime = Number(e.target.value);
            audioRef.current.currentTime = newTime; // Seek to the new time
            setCurrentTime(newTime);
          }}
          className="slider"
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <button onClick={() => (audioRef.current.currentTime -= 10)}>⏮️</button>
        <button
          onClick={() =>
            audioRef.current?.paused
              ? audioRef.current.play()
              : audioRef.current.pause()
          }
        >
          {audioRef.current?.paused ? "▶️" : "⏸️"}
        </button>
        <button onClick={() => (audioRef.current.currentTime += 10)}>⏭️</button>
      </div>
      <audio ref={audioRef} controls style={{ display: "none" }}>
        <source src={song.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default NowPlayingCard;
