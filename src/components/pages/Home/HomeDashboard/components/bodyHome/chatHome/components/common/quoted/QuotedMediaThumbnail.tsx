import { useLazyMedia } from "../../../../../../../../../../hooks/useLazyMedia";

export const QuotedMediaThumbnail = ({ mediaId }: { mediaId: string }) => {
  const { mediaUrl, isLoading } = useLazyMedia(mediaId);

  if (isLoading || !mediaUrl) {
    return <div className="quoted-thumb-placeholder" />;
  }

  return <img src={mediaUrl} alt="miniatura" className="quoted-thumb-image" />;
};
