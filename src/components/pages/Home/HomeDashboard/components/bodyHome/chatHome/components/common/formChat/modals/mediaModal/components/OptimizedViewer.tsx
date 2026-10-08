import { memo } from "react";
import { Document, Page } from "react-pdf";
import type { OptimizedViewerProps } from "../../../../../../../../../../../../../types/home/chatSectionTypes";

export const OptimizedViewer = memo(({ activeFile }: OptimizedViewerProps) => {
  if (!activeFile) return null;
  const isImage = activeFile.type.startsWith("image/");
  const isPDF = activeFile.type === "application/pdf";

  return (
    <div className="preview-main">
      {isImage ? (
        <img src={activeFile.url} alt="Preview" className="preview-image" />
      ) : isPDF ? (
        <div className="preview-iframe">
          <Document file={activeFile.url} loading="Cargando documento...">
            <Page
              pageNumber={1}
              width={400}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      ) : (
        <div className="preview-iframe">
          <p>Vista previa no disponible para este formato.</p>
        </div>
      )}
    </div>
  );
});
