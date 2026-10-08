import { useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";
import type { CameraModalProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useMediaCompression } from "../../../../../../../../../../../hooks/useUtilities";

export const CameraModal = ({ onClose, onCapture }: CameraModalProps) => {
  //Estados necesarios para el set de la camara
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { compressFiles } = useMediaCompression();

  //Effect que permite iniciar la camara
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accediendo a la cámara", err);
        alert("No se pudo acceder a la cámara.");
        onClose();
      }
    };
    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onClose]);

  //Manejo de la captura y almacenamiento en la aplicacion, se hace una compresion de archivo para poder ser mas eficiente al enviar
  const handleCapture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          try {
            const optimizedFiles = await compressFiles([file]);

            onCapture(optimizedFiles[0]);
          } catch (error) {
            console.error("Error al comprimir foto de la cámara", error);
            onCapture(file);
          }
        }
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="media-modal-overlay camera-mode">
      <div className="camera-header">
        <button onClick={onClose} className="modal-icon-btn">
          <X size={24} color="#54656f" />
        </button>
        <span className="camera-title">Tomar foto</span>
      </div>

      <div className="camera-video-container">
        <video ref={videoRef} autoPlay playsInline className="camera-video" />
      </div>

      <div className="camera-footer">
        <button onClick={handleCapture} className="camera-capture-btn">
          <Camera color="white" size={28} />
        </button>
      </div>
    </div>
  );
};
