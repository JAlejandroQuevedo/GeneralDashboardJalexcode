import { BeatLoader } from "react-spinners";
import { useLazyMedia } from "../../../../../../../../../../../../hooks/useLazyMedia";
import { Plyr } from "plyr-react";
import "plyr/dist/plyr.css";
import type { LazyVideoProps } from "../../../../../../../../../../../../types";

export const LazyVideo = ({ mediaId }: LazyVideoProps) => {
  const { mediaUrl, isLoading, hasError } = useLazyMedia(mediaId);
  if (isLoading) {
    return (
      <div className="video-placeholder">
        <BeatLoader size={10} color="#5BA8E8" />
      </div>
    );
  }

  if (hasError || !mediaUrl) {
    return (
      <div className="video-placeholder">
        <span>Video no disponible</span>
      </div>
    );
  }

  // Configuración de Plyr
  const plyrOptions = {
    // Controles que queremos mostrar en la barra inferior
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "pip",
      "fullscreen",
    ],
    settings: ["speed"],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
  };

  return (
    <div className="wa-video-container">
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: mediaUrl,
              provider: "html5",
            },
          ],
        }}
        options={plyrOptions}
      />
    </div>
  );
};
