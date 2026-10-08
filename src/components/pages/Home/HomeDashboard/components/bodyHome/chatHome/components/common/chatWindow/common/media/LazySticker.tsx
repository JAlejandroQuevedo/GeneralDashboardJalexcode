import { BeatLoader } from "react-spinners";
import { useLazyMedia } from "../../../../../../../../../../../../hooks/useLazyMedia";
import type { LazyMediaProps } from "../../../../../../../../../../../../types";

import { useState, useRef, useEffect, useCallback } from "react";

export const LazySticker = ({
  mediaId,
  altText = "Sticker",
}: LazyMediaProps) => {
  const { mediaUrl, isLoading, hasError } = useLazyMedia(mediaId);
  const [isAnimating, setIsAnimating] = useState(true);

  // Referencias para el DOM
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 1. Congelar el Sticker: Dibuja el fotograma exacto en el canvas y oculta el GIF/WebP
  const freezeSticker = useCallback(() => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx && img.naturalWidth) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setIsAnimating(false);
    }
  }, []);

  // Reproducir el Sticker: Muestra la imagen real y arranca la cuenta regresiva
  const playSticker = useCallback(() => {
    setIsAnimating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Congelar automáticamente después de 4 segundos
    timerRef.current = setTimeout(freezeSticker, 4000);
  }, [freezeSticker]);

  // Sensor de Pestaña: Detecta si el usuario sale o entra a tu app en el navegador
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        playSticker();
      } else {
        freezeSticker();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playSticker, freezeSticker]);

  // Sensor de Scroll: Detecta cuando el sticker entra al campo visual del chat
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playSticker();
        } else {
          freezeSticker();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [playSticker, freezeSticker]);
  // Manejo de estados de carga y error originales
  if (isLoading) {
    return (
      <div className="sticker-placeholder">
        <BeatLoader size={8} color="#8c9397" />
      </div>
    );
  }

  if (hasError || !mediaUrl) {
    return (
      <div className="sticker-placeholder">
        <span>Falló</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="sticker-container-wrapper"
      onClick={playSticker}
    >
      <img
        ref={imgRef}
        src={mediaUrl}
        alt={altText}
        className="wa-sticker-image"
        style={{ display: isAnimating ? "block" : "none" }}
        onLoad={playSticker}
        loading="lazy"
      />

      {/* "Clon" congelado */}
      <canvas
        ref={canvasRef}
        className="wa-sticker-image"
        style={{ display: isAnimating ? "none" : "block" }}
      />
    </div>
  );
};
