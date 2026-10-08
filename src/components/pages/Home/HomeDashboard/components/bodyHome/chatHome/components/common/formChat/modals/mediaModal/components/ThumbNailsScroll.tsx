import { Document, Page } from "react-pdf";
import type { ThumbNailsScrollPropsType } from "../../../../../../../../../../../../../types/home/chatSectionTypes";
import { X } from "lucide-react";
import { BeatLoader } from "react-spinners";

export const ThumbNailsScroll = ({
  previews,
  activeIndex,
  setActiveIndex,
  handleRemove,
  loadingCount,
}: ThumbNailsScrollPropsType) => {
  return (
    <div className="preview-thumbnails-scroll">
      {previews.map((preview, index) => (
        <div
          key={index}
          className={`thumbnail-wrapper ${activeIndex === index ? "active" : ""}`}
          onClick={() => setActiveIndex(index)}
        >
          <button
            onClick={(e) => handleRemove(index, e)}
            className="remove-thumbnail-btn"
          >
            <X color="#fdfdfd" size={14} />
          </button>

          {preview.type.startsWith("image/") ? (
            <img
              src={preview.url}
              className="preview-thumbnail-img"
              alt="Thumbnail"
            />
          ) : (
            <div className="preview-thumbnail-pdf">
              <Document file={preview.url} loading="Cargando documento...">
                <Page
                  pageNumber={1}
                  width={45}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          )}
        </div>
      ))}
      {Array.from({ length: loadingCount }).map((_, idx) => (
        <div
          key={`loading-${idx}`}
          className="thumbnail-wrapper loading-skeleton"
        >
          <BeatLoader size={8} color="#1b9229" />
        </div>
      ))}
    </div>
  );
};
