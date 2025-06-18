import { useState, useRef, useEffect } from "react";

export default function useAudioPlayer({ tracks = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // useRef é usado para obter uma referência direta ao elemento <audio> no DOM
  const audioRef = useRef(null);

  // Efeito para carregar a faixa quando o índice muda
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex];
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed", e));
      }
    }
  }, [currentTrackIndex, tracks]);

  // Efeito para controlar o volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // --- Funções de Controle ---

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.error("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const playPrev = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length
    );
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSetVolume = (newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    playNext,
    playPrev,
    toggleMute,
    setVolume: handleSetVolume,
    audioRef, // Exporta a ref para ser ligada ao elemento <audio> no App.jsx
  };
}
