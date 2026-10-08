import { useEffect, useRef, useState } from "react";
import { Trash, Mic, Pause, SendHorizontal } from "lucide-react";
import type { AudioRecorderBarProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const AudioRecorderBar = ({
  onSend,
  onCancel,
}: AudioRecorderBarProps) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  console.log(recordingTime);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      if (mediaRecorderRef.current?.state === "paused") return;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#8696a0";
      const barWidth = 3;
      const barSpacing = 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height * 0.8);
        const y = (canvas.height - barHeight) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight < 2 ? 2 : barHeight, 2);
        ctx.fill();

        x += barWidth + barSpacing;
      }
    };
    draw();
  };

  const cleanupAudio = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    audioChunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      recorder.start();

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setTimeout(() => drawWaveform(), 50);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono.");
      onCancel();
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setIsPaused(true);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setIsPaused(false);
    }
  };

  const handleSend = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/ogg",
        });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.ogg`, {
          type: "audio/ogg",
        });
        onSend(audioFile);
      };

      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    startRecording();
    return () => cleanupAudio();
  }, []);

  return (
    <div className="audio-recording-bar">
      <button type="button" onClick={onCancel} className="cancel-audio-btn">
        <Trash color="#ed3636" size={20} />
      </button>

      <div className="audio-recording-indicators">
        <div className={`recording-blinker ${isPaused ? "paused" : ""}`} />
        <span className="recording-time">{formatTime(recordingTime)}</span>
        <canvas
          ref={canvasRef}
          width={150}
          height={30}
          className="recording-canvas"
        />
      </div>

      <button
        type="button"
        onClick={togglePause}
        className="pause-audio-btn"
        style={{ marginRight: "10px" }}
      >
        {isPaused ? (
          <Mic color="#ed3636" size={20} />
        ) : (
          <Pause color="#ed3636" size={20} />
        )}
      </button>

      <button type="button" onClick={handleSend} className="submit-message">
        <SendHorizontal size={18} color="#9da3ab" />
      </button>
    </div>
  );
};
