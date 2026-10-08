import { useState } from "react";

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (documentUrl: string | null, userName: string) => {
    if (!documentUrl) {
      console.warn("No hay URL proporcionada para la descarga");
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(documentUrl);

      if (!response.ok) throw new Error("No se pudo obtener el documento");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      link.download = `Poliza_${userName}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      console.error("Error al forzar la descarga:", err);
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadFile, isDownloading, error };
};
