import { useEffect } from "react";
import { useLazyMedia } from "../../../../../../../../../../../../../hooks/useLazyMedia";
import { BeatLoader } from "react-spinners";

export const AlbumThumbnail = ({
  mediaId,
  onLoad,
  onClick,
  isLast,
  remainingCount,
}: any) => {
  const { mediaUrl, isLoading } = useLazyMedia(mediaId);

  useEffect(() => {
    if (mediaUrl) onLoad(mediaUrl);
  }, [mediaUrl]);

  if (isLoading) {
    return (
      <div className="album-thumb-placeholder">
        <BeatLoader size={8} color="#5BA8E8" />
      </div>
    );
  }

  if (!mediaUrl) return <div className="album-thumb-placeholder">Error</div>;

  return (
    <div className="album-thumb-wrapper" onClick={onClick}>
      <img src={mediaUrl} alt="miniatura" className="album-thumb-image" />

      {isLast && remainingCount > 0 && (
        <div className="album-overlay">+{remainingCount}</div>
      )}
    </div>
  );
};
