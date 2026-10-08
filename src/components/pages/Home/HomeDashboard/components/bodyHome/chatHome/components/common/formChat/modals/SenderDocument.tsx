import { Camera, FileText, Image } from "lucide-react";
import type { SenderDocumentProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useRef, type ChangeEvent } from "react";

export const SenderDocument = ({
  onFilesSelected,
  onOpenCamera,
}: SenderDocumentProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
    }
  };

  return (
    <div className="document-picker-container">
      <button
        className="sender-btn"
        onClick={() => imageInputRef.current?.click()}
      >
        <Image color="#4414FA" size={18} />
        <p>Fotos y videos</p>
        <input
          type="file"
          ref={imageInputRef}
          hidden
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/3gpp"
          onChange={handleFileChange}
        />
      </button>
      <button className="sender-btn" onClick={onOpenCamera}>
        <Camera color="#FF1279" size={18} />
        <p>Camara</p>
      </button>
      <button
        className="sender-btn"
        onClick={() => documentInputRef.current?.click()}
      >
        <FileText color="#9C00FD" size={18} />
        <p>Documentos</p>
        <input
          type="file"
          ref={documentInputRef}
          hidden
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleFileChange}
        />
      </button>
    </div>
  );
};
