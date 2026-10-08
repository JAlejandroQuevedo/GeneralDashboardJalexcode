import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import type {
  MediaPreviewModalProps,
  PreviewStateType,
} from "../../../../../../../../../../../../types/home/chatSectionTypes";
import {
  useMediaCompression,
  useUtilities,
} from "../../../../../../../../../../../../hooks/useUtilities";

import { OptimizedViewer } from "./components/OptimizedViewer";
import { PreviewHeader } from "./components/PreviewHeader";
import { ThumbNailsScroll } from "./components/ThumbNailsScroll";
import { InputButtonContainerModal } from "./components/InputButtonContainerModal";

export const MediaPreviewModal = ({
  files,
  onClose,
  onAddMore,
  onSend,
  onOpenCamera,
  onRemoveFile,
}: MediaPreviewModalProps) => {
  //Hook del compresor de imagenes
  const { compressFiles, cancelCompression } = useMediaCompression();

  //State que conteine los previews

  const [previews, setPreviews] = useState<PreviewStateType[]>([]);

  //Index de los previews
  const [activeIndex, setActiveIndex] = useState(0);

  //Estado para saber el numero de thumbnails a dibujar
  const [loadingCount, setLoadingCount] = useState(0);

  //Set del active file
  const activeFile = previews[activeIndex] || previews[0];

  //Input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  //Validador de sizes de whatsapp
  const { validateFile } = useUtilities();

  //Constante del media mode
  const isMediaMode =
    files[0]?.type.startsWith("image/") || files[0]?.type.startsWith("video/");
  const acceptTypes = isMediaMode
    ? "image/*,video/*"
    : ".pdf,.doc,.docx,.xls,.xlsx,.txt";

  //Efecto que ejecuta la logica
  useEffect(() => {
    const objectUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
    setPreviews(objectUrls);
    if (activeIndex >= objectUrls.length) {
      setActiveIndex(Math.max(0, objectUrls.length - 1));
    }
    return () =>
      objectUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [files]);

  //Handle para el add more files
  const handleAddMoreFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const rawFiles = Array.from(e.target.files);

      //Se muestran los cuadros de carga instantáneamente
      setLoadingCount(rawFiles.length);

      try {
        // Se optimizan los archivos en segundo plano
        const optimizedFiles = await compressFiles(rawFiles);
        const validFiles = optimizedFiles.filter(validateFile);

        // Se mandan al padre una vez cargados
        if (validFiles.length > 0) {
          onAddMore(validFiles);
          setActiveIndex(files.length);
        }
      } catch (error) {
        console.error("Error al procesar archivos extra:", error);
      } finally {
        //  Limpieza: quitar los loaders y resetear el input
        setLoadingCount(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  //Handle del remove files
  const handleRemove = (index: number, e: MouseEvent) => {
    e.stopPropagation();
    if (files.length === 1) {
      onClose();
      cancelCompression();
    } else {
      cancelCompression();
      onRemoveFile(index);
    }
  };

  //Si no hay un file activo se retorna null
  if (!activeFile) return null;
  const isLoading = loadingCount > 0;
  return (
    <div className="media-modal-overlay">
      <PreviewHeader onClose={onClose} activeFile={activeFile} />

      <OptimizedViewer activeFile={activeFile} />

      <div className="preview-footer">
        <div className="preview-action-ribbon">
          <ThumbNailsScroll
            previews={previews}
            setActiveIndex={setActiveIndex}
            handleRemove={handleRemove}
            activeIndex={activeIndex}
            loadingCount={loadingCount}
          />
          <InputButtonContainerModal
            fileInputRef={fileInputRef}
            acceptTypes={acceptTypes}
            handleAddMoreFiles={handleAddMoreFiles}
            onAddMore={() => fileInputRef.current?.click()}
            onOpenCamera={onOpenCamera}
            isMediaMode={isMediaMode}
            isDisabled={isLoading}
            files={files}
            onSend={onSend}
          />
        </div>
      </div>
    </div>
  );
};
