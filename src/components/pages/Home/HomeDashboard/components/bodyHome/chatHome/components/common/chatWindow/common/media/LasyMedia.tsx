import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { BeatLoader } from "react-spinners";
import { useLazyMedia } from "../../../../../../../../../../../../hooks/useLazyMedia";
import type { LazyMediaProps } from "../../../../../../../../../../../../types";
import { Reply, X, ZoomIn, ZoomOut } from "lucide-react";
import { useChatUIStore } from "../../../../../../../../../../../../stores/homeStore";

export const LazyMedia = ({
  mediaId,
  message,
  altText = "Imagen adjunta",
}: LazyMediaProps) => {
  const { mediaUrl, isLoading, hasError, isLightboxOpen, setIsLightboxOpen } =
    useLazyMedia(mediaId);
  const { setReplyingTo } = useChatUIStore();
  if (isLoading) {
    return (
      <div className="media">
        <BeatLoader size={10} color="#5BA8E8" />
      </div>
    );
  }

  if (hasError || !mediaUrl) {
    return (
      <div className="media">
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return (
    <>
      <div className="media">
        <img
          src={mediaUrl}
          alt={altText}
          className="lazy-media-image"
          onClick={() => setIsLightboxOpen(true)}
          loading="lazy"
        />
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={[{ src: mediaUrl, alt: altText }]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        toolbar={{
          buttons: [
            <button
              key="custom-action"
              type="button"
              className="yarl__button"
              onClick={() => {
                setReplyingTo(message);
                setIsLightboxOpen(false);
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
