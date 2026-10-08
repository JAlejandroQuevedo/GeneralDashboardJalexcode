import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormChatProps } from "../../../../../../../../../../types/home/chatSectionTypes";
import {
  messageSchema,
  type MessageFormType,
} from "../../../../../../../../../../types/form/formChat";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useApiToken } from "../../../../../../../../../../hooks/useApiToken";
import { config } from "../../../../../../../../../../config/config";
import { AIButton } from "./buttons/AIButton";
import { useUpdateDocument } from "../../../../../../../../../../functions/supabase/streaming/useUpdateDocument";
import { DisabledMessage } from "./DisabledMessage";
import { useChatUIStore } from "../../../../../../../../../../stores/homeStore";
import { SelectionBar } from "../chatWindow/common/SelectionBar";
import { QuotedMessage } from "../quoted/QuotedMessage";
import { SendButton } from "./buttons/SendButton";
import { AudioRecorderBar } from "./media/AudioRecorderBar";
import { AudioButton } from "./buttons/AudioButton";
import { EmojiButton } from "./buttons/EmojiButton";
import { SenderDocument } from "./modals/SenderDocument";
import { ButtonDocument } from "./buttons/ButtonDocument";
import { CameraModal } from "./modals/CameraModal";
import { MediaPreviewModal } from "./modals/mediaModal/MediaPreviewModal";
import { EmojiPicker } from "./containers/EmojiPicker";
import {
  useClipboardMedia,
  useMediaCompression,
  useUtilities,
} from "../../../../../../../../../../hooks/useUtilities";

import { SmartTextArea } from "../../../../../../../../../common/inputs/input/SmartTextArea";
import type { SmartEditorRef } from "../../../../../../../../../../types/form/inputsType";
import { MarkdownToolbar } from "./containers/MarkdownToolBar";
import { LoaderModal } from "./modals/LoaderModal";

export const ChatInputArea = ({
  onSendMessage,
  onSendAudio,
  onSendMedia,
  activeChat,
  activeChatInfo,
  chatHistory,
}: FormChatProps) => {
  //Hook de react hook form con zod
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<MessageFormType>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
    defaultValues: { message: "" },
  });
  const editorRef = useRef<SmartEditorRef | null>(null);
  //Obtenemos el valor de lo escrito en el input
  const messageValue = watch("message");
  const { compressFiles, isCompressing, cancelCompression } =
    useMediaCompression();

  //Evaluamos el contenido del objeto generado en el input
  const hasText = !!messageValue?.trim();
  //State para mostrar el grabador de audio
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  //Handle para cuando esta seleccionado un archivo desde el sistema del usuario
  const handleFilesSelected = async (files: File[]) => {
    setShowSender(false);
    const optimizedFiles = await compressFiles(files);

    setPendingFiles((prev) => [...prev, ...optimizedFiles]);
  };
  //Se maneja la captura de la foto mediante la camara
  const handleCameraCapture = (file: File) => {
    setIsCameraOpen(false);
    setPendingFiles((prev) => [...prev, file]);
  };

  //Store para reply y selected messages

  const { selectedMessages, replyingTo, clearReply } = useChatUIStore();
  const isSelectedMessages = selectedMessages.length > 0;
  //State que maneja el procesamiento del formulario

  const [isButtonProcesing, setIsButtonProcessing] = useState(false);

  //Hook que maneja la llamada a la api

  const { postApiToken } = useApiToken();

  //Hook que maneja el update del documento

  const { updateDoc } = useUpdateDocument("chat");

  //Estado para mostrar el emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //Estado para mostrar el sender document
  const [showSender, setShowSender] = useState(false);

  //Handle para el click outside del componente, para cerrar los states cuando se hace click fuera del componente

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".chat-input-area")) {
        setShowEmojiPicker(false);
        setShowSender(false);
      }
    };

    // Usamos 'mousedown' para que reaccione instantáneamente al toque
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza del listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //Funcion para insertar el emoji en el textarea
  const onEmojiClick = (emojiData: any) => {
    if (editorRef.current) {
      editorRef.current.insertEmoji(emojiData.native);
    }
  };

  //Logica para determinar cundo se envio el ultimo mensaje del chat
  const { hasPassed24Hours } = useUtilities();
  const lastMessageChat = activeChatInfo[0].last_message_time;
  const isChatDisabled = hasPassed24Hours(lastMessageChat);

  //Funcion que maneja el envio del formulario

  const onSubmit = async (data: MessageFormType) => {
    const textToSubmit = data.message
      .replace(/\\-/g, "-")
      .replace(/\\\n/g, "\n")
      .replace(/\\$/gm, "");
    reset();
    setShowEmojiPicker(false);

    try {
      (async () => {
        try {
          await onSendMessage(textToSubmit);
          await updateDoc(activeChat, { total_messages: 0 });
        } catch (error) {
          console.error("Error al enviar el mensaje en segundo plano", error);
        }
      })();
    } catch (error) {
      throw new Error("Error al enviar el mensaje");
    } finally {
    }
  };

  //Manejo del envio de audio
  const handleAudioSend = async (audioFile: File) => {
    setIsRecordingMode(false); // Oculta la barra de grabación
    try {
      await onSendAudio(audioFile);
    } catch (error) {
      console.error("Error al enviar la nota de voz", error);
    }
  };
  //Manejo de envio multimedia
  const handleSendMedia = async (files: File[], caption: string) => {
    try {
      setPendingFiles([]);

      await new Promise((resolve) => setTimeout(resolve, 10));
      onSendMedia(files, caption);
    } catch (error) {
      console.error("Error enviando media", error);
    }
  };

  //Clipboard media hook

  useClipboardMedia({
    onFilesPasted: (files) => {
      setPendingFiles((prev) => [...prev, ...files]);
      setShowSender(false);
    },
  });
  //Función para enviar mensaje con Enter
  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  //Funcion que maneja el disabled del buton context

  const isContextButtonDisabled = isButtonProcesing || chatHistory.length < 10;

  //Variable que maneja el disabled del button

  const isButtonDisabled = isChatDisabled;

  //AI function
  const handleAIContext = async () => {
    if (isContextButtonDisabled) return;
    setIsButtonProcessing(true);

    try {
      const last10Messages = chatHistory.slice(-10);
      await postApiToken({
        url: "context",
        token: config.BEARER_TOKEN,
        body: {
          action: "summarize",
          data: last10Messages,
          chatId: last10Messages[0].chat_id,
        },
      });
    } catch (error) {
      throw new Error("Error al generar contexto");
    } finally {
      setIsButtonProcessing(false);
    }
  };

  return (
    <>
      {/* Si una foto esta siendo comprimida se muestra un loader */}
      {isCompressing && (
        <LoaderModal
          onClick={() => {
            cancelCompression();
            setPendingFiles([]);
          }}
        />
      )}

      {/* Componente para mostrar la camara */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}
      {/* Modal para mostrar la multimedia si hay un archivo existente */}
      {pendingFiles.length > 0 && !isCameraOpen && (
        <MediaPreviewModal
          files={pendingFiles}
          onClose={() => {
            setPendingFiles([]);
            cancelCompression();
          }}
          onAddMore={(newFiles: File[]) => {
            setPendingFiles((prev) => [...prev, ...newFiles]);
          }}
          onSend={handleSendMedia}
          onOpenCamera={() => setIsCameraOpen(true)}
          onRemoveFile={(index) =>
            setPendingFiles((prev) => prev.filter((_, i) => i !== index))
          }
        />
      )}
      {/* Contenido del textarea */}
      <div
        style={
          {
            "--dinamic-background": !isSelectedMessages ? "#fdfdfd" : "none",
            "--dinamic-chat-padding": !isSelectedMessages ? "5px 10px" : "0",
            "--dinamic-form-padding": !isSelectedMessages ? "0 20px" : "0",
          } as CSSProperties
        }
        className="chat-input-area"
      >
        {/* Componente para mensajes citados */}
        {replyingTo && (
          <QuotedMessage
            chat={activeChatInfo[0]}
            fullWidth={true}
            onClick={clearReply}
            quotedMsg={replyingTo}
          />
        )}
        {/* Componente para mostrar el recuadro de emojis */}
        {showEmojiPicker && !isSelectedMessages && (
          <>
            {showEmojiPicker && !isSelectedMessages && (
              <EmojiPicker onEmojiClick={onEmojiClick} />
            )}
          </>
        )}
        {/* Componente de menu de multimedia sender */}
        {showSender && !isSelectedMessages && (
          <SenderDocument
            onFilesSelected={handleFilesSelected}
            onOpenCamera={() => {
              setShowSender(false);
              setIsCameraOpen(true);
            }}
          />
        )}
        {/* Formulario que maneja el envio del chat */}
        <form className="chat-input-form" onSubmit={handleSubmit(onSubmit)}>
          {isSelectedMessages ? (
            // Si la barra de seleccion esta activa, no se muestra el componente del input
            <SelectionBar />
          ) : isRecordingMode ? (
            // Si se esta grabando un audio, no se muestra el componente del input
            <AudioRecorderBar
              onSend={handleAudioSend}
              onCancel={() => setIsRecordingMode(false)}
            />
          ) : (
            <>
              {/* Boton para abrir el menu de documentos */}
              <ButtonDocument
                isDisabled={showEmojiPicker}
                showSender={showSender}
                onClick={() => {
                  setShowSender(!showSender);
                }}
              />

              {/* Botón para abrir/cerrar emojis */}
              <EmojiButton
                isDisabled={showSender}
                showEmojiPicker={showEmojiPicker}
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                }}
              />
              {/* Text area para el mensaje */}

              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <SmartTextArea
                    ref={editorRef}
                    id="message"
                    placeholder="Escribe tu mensaje..."
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isButtonDisabled}
                    onKeyDownTextArea={handleKeyDown}
                  />
                )}
              />

              {/* Contenedor de los botones */}
              <div className="btn-containers">
                {/* MARKDOWN TOOLBAR */}
                {!isButtonDisabled && hasText && (
                  <MarkdownToolbar editorRef={editorRef} />
                )}
                {/* Boton para el generador de contexto con IA */}
                <AIButton
                  isContextButtonDisabled={isContextButtonDisabled}
                  chatHistory={chatHistory}
                  onSendMessage={handleAIContext}
                  isButtonProcessing={isButtonProcesing}
                />
                {/* Boton que maneja el envio de los mensajes */}
                {hasText ? (
                  <SendButton
                    isSubmiting={isSubmitting}
                    isButtonDisabled={isButtonDisabled}
                    isChatDisabled={isChatDisabled}
                  />
                ) : (
                  // Boton para el manejo de envio de audios y grabacion
                  <>
                    <AudioButton
                      isButtonDisabled={isButtonDisabled}
                      onClick={() => {
                        setShowEmojiPicker(false);
                        setIsRecordingMode(true);
                      }}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </form>
      </div>
      {isChatDisabled && <DisabledMessage />}
    </>
  );
};
