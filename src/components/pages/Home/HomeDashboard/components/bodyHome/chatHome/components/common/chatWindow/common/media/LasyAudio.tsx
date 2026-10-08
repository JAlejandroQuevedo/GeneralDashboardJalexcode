import { BeatLoader } from "react-spinners";
import { useLazyMedia } from "../../../../../../../../../../../../hooks/useLazyMedia";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/plugins/hover";
import type { LazyAudioProps } from "../../../../../../../../../../../../types";
import {
  PlayIcon,
  PuauseIcon,
} from "../../../../../../../../../../../../constants/icons/Icons";
import { ChevronDown, ChevronUp } from "lucide-react";

export const LazyAudio = ({ mediaId, transcript }: LazyAudioProps) => {
  const { mediaUrl, isLoading, hasError } = useLazyMedia(mediaId);
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Estados para manejar el tiempo
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  //Estado para manejar el menu desplegable
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_TRANSCRIPT_LENGTH = 90;
  //Función para formatear segundos a MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (!mediaUrl || !containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#A0A0A0",
      progressColor: "#34B7F1",
      cursorColor: "#34B7F1",
      cursorWidth: 5,
      dragToSeek: true,
      height: 35,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      url: mediaUrl,
      plugins: [
        Hover.create({
          lineColor: "#54656f",
          lineWidth: 2,
          labelBackground: "rgba(0, 0, 0, 0.7)",
          labelColor: "#fff",
          labelSize: "10px",
        }),
      ],
    });

    wavesurferRef.current.on("play", () => setIsPlaying(true));
    wavesurferRef.current.on("pause", () => setIsPlaying(false));

    // Al terminar, reseteamos el botón de play pero dejamos la onda al final
    wavesurferRef.current.on("finish", () => {
      setIsPlaying(false);
    });

    // Capturar la duración total cuando el audio carga
    wavesurferRef.current.on("ready", () => {
      setDuration(wavesurferRef.current?.getDuration() || 0);
    });
    // Actualizar el tiempo actual mientras se reproduce o se arrastra
    wavesurferRef.current.on("timeupdate", (time) => {
      setCurrentTime(time);
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [mediaUrl]);

  const onPlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  const toggleSpeed = () => {
    let nextSpeed = 1;
    if (playbackRate === 1) nextSpeed = 1.5;
    else if (playbackRate === 1.5) nextSpeed = 2;

    setPlaybackRate(nextSpeed);

    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(nextSpeed);
    }
  };

  if (isLoading) {
    return (
      <div className="audio-placeholder">
        <BeatLoader size={10} color="#5BA8E8" />
      </div>
    );
  }

  if (hasError || !mediaUrl) {
    return (
      <div className="audio-placeholder">
        <span>Audio no disponible</span>
      </div>
    );
  }
  const needsExpansion =
    transcript && transcript.length > MAX_TRANSCRIPT_LENGTH;
  const displayedText =
    needsExpansion && !isExpanded
      ? `${transcript.slice(0, MAX_TRANSCRIPT_LENGTH)}...`
      : transcript;
  return (
    <div className="audio-message-wrapper">
      {/* Reproductor Horizontal */}
      <div className="wa-audio-player">
        <button onClick={onPlayPause} className="wa-play-btn" type="button">
          {isPlaying ? <PuauseIcon /> : <PlayIcon />}
        </button>

        {/* Contenedor de Onda y Tiempo */}
        <div className="wa-waveform-container">
          <div ref={containerRef} className="wa-waveform" />
          <span className="wa-audio-time">
            {isPlaying || currentTime > 0
              ? formatTime(currentTime)
              : formatTime(duration)}
          </span>
        </div>

        <button onClick={toggleSpeed} className="wa-speed-btn" type="button">
          {playbackRate}x
        </button>
      </div>

      {/* Transcripción (Debajo del reproductor) */}
      {transcript && (
        <div className="wa-transcript-box">
          <div className="transcript-header">
            <span>Transcripción</span>
          </div>
          <span className="transcript-text">"{displayedText}"</span>
          {needsExpansion && (
            <button
              className="transcript-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp size={15} color="#959595" />
              ) : (
                <ChevronDown size={15} color="#959595" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
