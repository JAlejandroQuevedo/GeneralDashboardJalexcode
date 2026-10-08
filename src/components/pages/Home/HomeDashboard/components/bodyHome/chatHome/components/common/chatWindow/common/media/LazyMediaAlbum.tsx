import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Reply, X, ZoomIn, ZoomOut } from "lucide-react";
import { useChatUIStore } from "../../../../../../../../../../../../stores/homeStore";
import { AlbumThumbnail } from "./common/AlbumThumbnail";

export const LazyMediaAlbum = ({ messages }: { messages: any[] }) => {
  const { setReplyingTo, targetMediaToOpen, setTargetMediaToOpen } =
    useChatUIStore();

  const [isListOpen, setIsListOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Diccionario para guardar las URLs una vez que los hijos las descarguen
  const [urls, setUrls] = useState<Record<string, string>>({});

  const handleUrlLoad = (id: string, url: string) => {
    setUrls((prev) => ({ ...prev, [id]: url }));
  };
  // Efecto que escucha si alguien hizo clic en un 'QuotedMessage'
  useEffect(() => {
    if (targetMediaToOpen) {
      const foundIndex = messages.findIndex(
        (m) => m.wa_id === targetMediaToOpen,
      );

      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex);
        setIsViewerOpen(true);
        setTargetMediaToOpen(null);
      }
    }
  }, [targetMediaToOpen, messages, setTargetMediaToOpen]);
  // Preparamos los slides para el Lightbox
  const slides = messages
    .filter((m) => urls[m.media_id])
    .map((m) => ({ src: urls[m.media_id], alt: "Imagen de álbum" }));

  return (
    <>
      <div className="media-album-grid">
        {/* Mostramos máximo 4 miniaturas */}
        {messages.slice(0, 4).map((msg, index) => (
          <div
            key={msg.id}
            data-wa-id={msg.wa_id}
            style={{ display: "contents" }}
          >
            <AlbumThumbnail
              key={msg.id}
              mediaId={msg.media_id}
              onLoad={(url: string) => handleUrlLoad(msg.media_id, url)}
              onClick={() => {
                setIsListOpen(true);
              }}
              isLast={index === 3}
              remainingCount={messages.length - 4}
            />
          </div>
        ))}
      </div>

      {/* MODAL INTERMEDIO (Galería con todas las fotos) */}
      {isListOpen && (
        <div className="album-modal-overlay">
          <div className="album-modal-container">
            <div className="album-modal-header">
              <span>Álbum ({messages.length} fotos)</span>
              <button
                onClick={() => setIsListOpen(false)}
                className="close-modal-btn"
              >
                <X size={20} color="#54656f" />
              </button>
            </div>

            <div className="album-modal-content">
              {messages.map((msg, index) => (
                <AlbumThumbnail
                  key={`modal-${msg.id}`}
                  mediaId={msg.media_id}
                  onLoad={(url: string) => handleUrlLoad(msg.media_id, url)}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsViewerOpen(true);
                  }}
                  isLast={false}
                  remainingCount={0}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Lightbox
        open={isViewerOpen}
        index={currentIndex}
        close={() => setIsViewerOpen(false)}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 2 }}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
        toolbar={{
          buttons: [
            <button
              key="custom-action"
              type="button"
              className="yarl__button"
              onClick={() => {
                const exactMessageToReply = messages[currentIndex];
                setReplyingTo(exactMessageToReply);
                setIsListOpen(false);
                setIsViewerOpen(false);
              }}
              title="Mi Acción Personalizada"
            >
              <Reply color="#fdfdfd" />
            </button>,
            "zoom",
            "close",
          ],
        }}
        // PERSONALIZACIÓN DE ÍCONOS NATIVOS
        render={{
          iconClose: () => <X color="#fdfdfd" />,
          iconZoomIn: () => <ZoomIn color="#fdfdfd" />,
          iconZoomOut: () => <ZoomOut color="#fdfdfd" />,
        }}
      />
    </>
  );
};
