import { useEffect, useState } from "react";
import { config } from "../config/config";
import { FileArchive } from "lucide-react";
import { IconInput } from "../components/common/icons/IconInput";

export const useLazyMedia = (mediaId: string) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (mediaId === "isLoading") {
      setIsLoading(true);
      setHasError(false);
      return;
    }
    const fetchAndCacheMedia = async () => {
      try {
        setIsLoading(true);
        const cache = await caches.open("whatsapp-media-cache-v1");
        const cachedResponse = await cache.match(mediaId);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          setMediaUrl(URL.createObjectURL(blob));
          setIsLoading(false);
          return;
        }

        const token = config.BEARER_TOKEN;
        const imageResponse = await fetch(
          `${config.VITE_API_WHATSAPP_URL}/media/${mediaId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!imageResponse.ok) {
          throw new Error(`Error del backend: ${imageResponse.status}`);
        }

        await cache.put(mediaId, imageResponse.clone());

        const blob = await imageResponse.blob();
        setMediaUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error procesando multimedia:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCacheMedia();
  }, [mediaId]);

  useEffect(() => {
    return () => {
      if (mediaUrl && mediaUrl.startsWith("blob:")) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  // Función para determinar color, icono y extensión
  const getDocumentTheme = (mimeType: string, fileName: string) => {
    const type = (mimeType || "application/octet-stream").toLowerCase();
    const name = (fileName || "Documento adjunto").toLowerCase();

    if (type.includes("pdf") || name.endsWith(".pdf")) {
      return {
        className: "pdf",
        icon: <IconInput icon="/img/icons/pdf_icon.svg" alt="Icono de pdf" />,
        ext: "PDF",
      };
    }
    if (
      type.includes("word") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return {
        className: "word",
        icon: <IconInput icon="/img/icons/word_icon.svg" alt="Icono de WORD" />,
        ext: "DOCX",
      };
    }
    if (
      type.includes("excel") ||
      type.includes("spreadsheet") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    ) {
      return {
        className: "excel",
        icon: (
          <IconInput icon="/img/icons/excel_icon.svg" alt="Icono de Excel" />
        ),
        ext: "XLSX",
      };
    }
    if (type.includes("zip") || type.includes("rar") || name.endsWith(".zip")) {
      return {
        className: "zip",
        icon: <IconInput icon="/img/icons/zip_icon.svg" alt="Icono de zip" />,
        ext: "ZIP",
      };
    }

    const extMatch = name.split(".").pop();
    return {
      className: "default",
      icon: <FileArchive size={24} />,
      ext: extMatch ? extMatch.toUpperCase() : "DOC",
    };
  };

  return {
    mediaUrl,
    isLoading,
    hasError,
    isLightboxOpen,
    setIsLightboxOpen,
    getDocumentTheme,
  };
};
