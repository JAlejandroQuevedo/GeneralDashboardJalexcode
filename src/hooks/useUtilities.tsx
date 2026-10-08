import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MessageType } from "../types/home/chatSectionTypes";
import imageCompression from "browser-image-compression";
import type { UseClipboardMediaProps } from "../types";
export const useUtilities = () => {
  //Funcion para determinar un periodo de 24 horas
  const hasPassed24Hours = (lastMessageTime: string) => {
    if (!lastMessageTime) return false;

    const lastDate = new Date(lastMessageTime);

    const currentDate = new Date();

    const differenceInMs = currentDate.getTime() - lastDate.getTime();

    const msIn24Hours = 24 * 60 * 60 * 1000;

    return differenceInMs >= msIn24Hours;
  };
  //Funcion para obtener el tiempo relativo en minutos, horas, dias, meses o años
  const getRelativeTime = (dateString: string | undefined): string => {
    if (!dateString) return "";

    const pastDate = new Date(dateString);
    const now = new Date();

    // Diferencia en segundos
    const diffInSeconds = Math.floor(
      (now.getTime() - pastDate.getTime()) / 1000,
    );

    if (diffInSeconds < 0) return "Ahora";

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (diffInSeconds < 60) {
      return "Ahora";
    }

    if (minutes < 60) {
      return `Hace ${minutes} min`;
    }

    if (hours < 24) {
      return `Hace ${hours} h`;
    }

    if (days === 1) {
      return "Ayer";
    }

    if (days < 30) {
      return `Hace ${days} d`;
    }

    if (months < 12) {
      return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
    }

    return `Hace ${years} ${years === 1 ? "año" : "años"}`;
  };

  //Funcion par formatear el numero de telefonode manera limpia
  const formatPhoneNumber = (phone: string | number): string => {
    if (!phone) return "";

    const cleaned = phone.toString().replace(/\D/g, "");

    let localNumber = cleaned;
    let hasCountryCode = false;

    if (cleaned.startsWith("521") && cleaned.length === 13) {
      localNumber = cleaned.substring(3);
      hasCountryCode = true;
    } else if (cleaned.startsWith("52") && cleaned.length === 12) {
      localNumber = cleaned.substring(2);
      hasCountryCode = true;
    } else if (cleaned.length === 10) {
      hasCountryCode = false;
    } else {
      return cleaned.length > 10 ? `+${cleaned}` : cleaned;
    }

    let formattedLocal = "";
    const lada2 = localNumber.substring(0, 2);

    if (["33", "55", "81"].includes(lada2)) {
      formattedLocal = `(${lada2}) ${localNumber.slice(2, 6)}-${localNumber.slice(6)}`;
    } else {
      formattedLocal = `(${localNumber.slice(0, 3)}) ${localNumber.slice(3, 6)}-${localNumber.slice(6)}`;
    }

    return hasCountryCode ? `+52 ${formattedLocal}` : formattedLocal;
  };

  //Utilidad para obener el primer nombre
  const getFirstName = (fullName?: string): string => {
    if (!fullName) return "";
    return fullName.trim().split(" ")[0];
  };

  //Obtener el tiempo segun los dos timers del chat

  const getLastActiveMessage = (
    messages: MessageType[],
    chatId: string,
  ): MessageType | undefined => {
    const chatMessages = messages.filter((m) => m.chat_id === chatId);

    if (chatMessages.length === 0) return undefined;

    const getMessageMaxTime = (msg: MessageType) =>
      Math.max(
        new Date(msg.created_at || 0).getTime(),
        new Date(msg.reaction_time || 0).getTime(),
      );

    return chatMessages.reduce((latest, current) => {
      return getMessageMaxTime(current) > getMessageMaxTime(latest)
        ? current
        : latest;
    });
  };

  //Limites de whatsapp

  const MAX_SIZES = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 16 * 1024 * 1024, // 16MB
    DOCUMENT: 100 * 1024 * 1024, // 100MB
  };

  //Funcion para para validar los limites de los archivos

  const validateFile = (file: File) => {
    if (file.type.startsWith("image/") && file.size > MAX_SIZES.IMAGE) {
      alert(`La imagen ${file.name} supera el límite de 5MB de WhatsApp.`);
      return false;
    }
    if (file.type.startsWith("video/") && file.size > MAX_SIZES.VIDEO) {
      alert(`El video ${file.name} supera el límite de 16MB de WhatsApp.`);
      return false;
    }
    if (file.size > MAX_SIZES.DOCUMENT) {
      alert(`El archivo ${file.name} supera el límite de 100MB.`);
      return false;
    }
    return true;
  };
  return {
    hasPassed24Hours,
    getRelativeTime,
    formatPhoneNumber,
    getFirstName,
    getLastActiveMessage,
    validateFile,
  };
};
//Funcion para agrupar mensajes
export const useGroupedMessages = (messages: MessageType[]) => {
  const groupedMessages = useMemo(() => {
    const result: any[] = [];
    let currentAlbum: any[] = [];

    messages.forEach((msg) => {
      // Condición para agrupar: Es imagen, NO tiene texto (caption) y NO es una respuesta
      const isGroupableImage =
        msg.media_type === "image" && !msg.text && !msg.reply_to_id;

      if (isGroupableImage) {
        if (currentAlbum.length === 0) {
          currentAlbum.push(msg);
        } else {
          const prevMsg = currentAlbum[currentAlbum.length - 1];
          const isSameSender = prevMsg.sender === msg.sender;
          // Diferencia menor a 60 segundos
          const timeDiff =
            new Date(msg.created_at).getTime() -
            new Date(prevMsg.created_at).getTime();

          if (isSameSender && timeDiff < 60000) {
            currentAlbum.push(msg);
          } else {
            // Cerramos el álbum anterior y empezamos uno nuevo
            result.push(
              currentAlbum.length === 1
                ? currentAlbum[0]
                : {
                    isAlbum: true,
                    id: `album-${currentAlbum[0].id}`,
                    messages: currentAlbum,
                    sender: currentAlbum[0].sender,
                    created_at:
                      currentAlbum[currentAlbum.length - 1].created_at,
                  },
            );
            currentAlbum = [msg];
          }
        }
      } else {
        if (currentAlbum.length > 0) {
          result.push(
            currentAlbum.length === 1
              ? currentAlbum[0]
              : {
                  isAlbum: true,
                  id: `album-${currentAlbum[0].id}`,
                  messages: currentAlbum,
                  sender: currentAlbum[0].sender,
                  created_at: currentAlbum[currentAlbum.length - 1].created_at,
                },
          );
          currentAlbum = [];
        }
        result.push(msg);
      }
    });

    if (currentAlbum.length > 0) {
      result.push(
        currentAlbum.length === 1
          ? currentAlbum[0]
          : {
              isAlbum: true,
              id: `album-${currentAlbum[0].id}`,
              messages: currentAlbum,
              sender: currentAlbum[0].sender,
              created_at: currentAlbum[currentAlbum.length - 1].created_at,
            },
      );
    }

    return result;
  }, [messages]);

  return {
    groupedMessages,
  };
};

//Funcion para limpiar historial
export const useCleanHistory = (
  messages: MessageType[],
  activeChat: string,
): { cleanHistory: MessageType[] } => {
  const cleanHistory = messages
    // 1. Filtrar los mensajes no deseados
    .filter((m) => {
      // Mantener solo los del chat activo
      const isActiveChat = m.chat_id === activeChat;

      // Lista de tipos que queremos ignorar completamente
      const ignoredTypes = ["image", "document", "video", "sticker"];
      const mediaType = m.media_type ?? "";
      const isNotIgnored = !ignoredTypes.includes(mediaType);

      return isActiveChat && isNotIgnored;
    })
    // 2. Transformar los mensajes válidos
    .map((m) => {
      // Si es audio, reemplazamos el contenido principal con su transcripción
      if (m.media_type === "audio") {
        return {
          ...m,
          text: m.transcript ?? "",
        };
      }

      // Si es un mensaje de texto normal, lo retornamos intacto
      return m;
    });

  return {
    cleanHistory,
  };
};

//Compresor de imagenes
export const useMediaCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);

  // Referencia para almacenar nuestro "botón de pánico"
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para cancelar el proceso desde cualquier parte
  const cancelCompression = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const compressFiles = useCallback(
    async (rawFiles: File[]): Promise<File[]> => {
      setIsCompressing(true);

      // Creamos un nuevo controlador exclusivo para este intento
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const compressionOptions = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          signal: abortController.signal,
        };

        const processedFiles = await Promise.all(
          rawFiles.map(async (file) => {
            if (abortController.signal.aborted) {
              throw new Error("AbortError");
            }

            if (
              file.type.startsWith("image/") &&
              file.type !== "image/svg+xml" &&
              file.type !== "image/gif"
            ) {
              try {
                console.log(
                  `Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
                );
                const compressedBlob = await imageCompression(
                  file,
                  compressionOptions,
                );

                if (abortController.signal.aborted) {
                  throw new Error("AbortError");
                }

                const compressedFile = new File([compressedBlob], file.name, {
                  type: compressedBlob.type,
                  lastModified: Date.now(),
                });

                console.log(
                  `Comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
                );
                return compressedFile;
              } catch (error: any) {
                if (
                  error.name === "AbortError" ||
                  error.message === "AbortError"
                ) {
                  throw error;
                }
                console.error("Error comprimiendo imagen", error);
                return file;
              }
            }
            return file;
          }),
        );

        return processedFiles;
      } catch (error: any) {
        if (error.name === "AbortError" || error.message === "AbortError") {
          console.log("⚠️ Compresión cancelada por el usuario.");
          return [];
        }
        console.error("Error crítico en compresor:", error);
        return [];
      } finally {
        setIsCompressing(false);
        abortControllerRef.current = null;
      }
    },
    [],
  );

  // Exportamos la función de cancelar
  return { compressFiles, isCompressing, cancelCompression };
};

//Hook para la funcion de copy paste

export const useClipboardMedia = ({
  onFilesPasted,
}: UseClipboardMediaProps) => {
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        // Buscamos si el elemento en el portapapeles es un archivo (imagen, pdf, etc.)
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        onFilesPasted(pastedFiles);
      }
    };

    document.addEventListener("paste", handleGlobalPaste);

    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [onFilesPasted]);
};
