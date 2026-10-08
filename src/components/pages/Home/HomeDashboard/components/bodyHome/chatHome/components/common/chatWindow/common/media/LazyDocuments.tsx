import { File, Download, X, Reply } from "lucide-react";
import { useLazyMedia } from "../../../../../../../../../../../../hooks/useLazyMedia";
import { useState, type MouseEvent } from "react";
import { BeatLoader } from "react-spinners";
import type { LazyDocumentProps } from "../../../../../../../../../../../../types";
import { useChatUIStore } from "../../../../../../../../../../../../stores/homeStore";

export const LazyDocument = ({
  mediaId,
  message,
  fileName = "Documento adjunto",
  mimeType = "application/octet-stream",
}: LazyDocumentProps) => {
  const { mediaUrl, isLoading, hasError, getDocumentTheme } =
    useLazyMedia(mediaId);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { setReplyingTo } = useChatUIStore();

  const theme = getDocumentTheme(mimeType, fileName);
  const isPdf = theme.ext === "PDF";

  const handleCardClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isPdf) {
      e.preventDefault();
      setIsPreviewOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div
        className="wa-document-card"
        style={{ justifyContent: "center", height: "68px" }}
      >
        <BeatLoader size={10} color="#5BA8E8" />
      </div>
    );
  }

  if (hasError || !mediaUrl) {
    return (
      <div className="wa-document-card">
        <div className="wa-doc-icon default">
          <File size={24} />
        </div>
        <div className="wa-doc-info">
          <span className="wa-doc-name">Archivo no disponible</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TARJETA DEL DOCUMENTO */}
      <a
        href={mediaUrl}
        download={isPdf ? undefined : fileName}
        className="wa-document-card"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCardClick}
      >
        <div className={`wa-doc-icon ${theme.className}`}>{theme.icon}</div>

        <div className="wa-doc-info">
          <span className="wa-doc-name" title={fileName}>
            {fileName}
          </span>
          <span className="wa-doc-meta">
            {theme.ext} •{" "}
            {isPdf ? "Toque para previsualizar" : "Archivo adjunto"}
          </span>
        </div>

        <div className="wa-doc-download">
          <Download size={20} />
        </div>
      </a>

      {isPreviewOpen && isPdf && (
        <div className="wa-modal-overlay">
          <div className="wa-modal-content">
            <div className="wa-modal-header">
              <span>{fileName}</span>
              <div className="button-modal-container">
                <button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setReplyingTo(message);
                  }}
                  className="wa-modal-btn"
                  title="Responder"
                  type="button"
                >
                  <Reply size={24} color="#fdfdfd" />
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="wa-modal-btn"
                  title="Cerrar visor"
                  type="button"
                >
                  <X color="#ffff" size={24} />
                </button>
              </div>
            </div>

            <iframe
              src={`${mediaUrl}#toolbar=0`}
              className="wa-modal-iframe"
              title={fileName}
            />
          </div>
        </div>
      )}
    </>
  );
};
