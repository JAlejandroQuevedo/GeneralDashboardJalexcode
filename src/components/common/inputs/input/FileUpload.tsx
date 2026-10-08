import { useRef, useState } from "react";
import type { FileUploadProps } from "../../../../types/form/inputsType";

export const FileUpload = ({
  value,
  onChange,
  error,
  disabled = false,
  width,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    value ? value.name : null,
  );

  const handleSelectFile = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    setFileName(file ? file.name : null);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
    setFileName(null);
  };

  return (
    <div className={`fileUploadWrapper ${disabled ? "disabled" : ""}`}>
      <div>
        <button
          type="button"
          className="uploadButton"
          style={width ? { width } : undefined}
          onClick={handleSelectFile}
          disabled={disabled}
        >
          <img
            className="fileIcon"
            src="/img/icons/iconUpload.svg"
            alt="Icono de subir archivos"
          />
          Subir archivo
        </button>
        {error && <span className="errorMsg">{error}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={disabled}
      />
      {fileName ? (
        <div className="fileInfo">
          <span>{fileName}</span>
          <button type="button" className="clearButton" onClick={handleClear}>
            <img
              src="/img/icons/FileDelete.svg"
              alt="Icono para borrar archivo"
            />
          </button>
        </div>
      ) : (
        <span className="placeholderText">
          {disabled
            ? "No se puede seleccionar un archivo"
            : "Ningún archivo seleccionado"}
        </span>
      )}
    </div>
  );
};
