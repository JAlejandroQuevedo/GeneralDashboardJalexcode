import { X, Trash2, SquareArrowOutUpRight, Forward } from "lucide-react";
import { useChatUIStore } from "../../../../../../../../../../../stores/homeStore";
import { useDeleteChats } from "../../../../../../../../../../../hooks/useDeleteChats";

export const SelectionBar = () => {
  //Se llama al store que almacena todo el ui del chat
  const {
    setReplyingTo,
    selectedMessages,
    clearSelection,
    setDeletingIds,
    selectionType,
    setForwardModalOpen,
  } = useChatUIStore();

  //Se llama al hook que maneja la limpieza de los chats

  const { deleteMessages, deleting } = useDeleteChats();

  //Si la seleccion de mensajes es null, se retorna null
  if (selectedMessages.length === 0) return null;

  //Handle para el delete de los mensajes
  const handleDelete = async () => {
    const ids = selectedMessages.map((m) => m.id);
    setDeletingIds(ids);
    await deleteMessages(selectedMessages);
    clearSelection();
    setDeletingIds([]);
  };

  console.log(selectedMessages.length);
  return (
    <div className="selection-bar">
      <div className="selection-left">
        <button onClick={clearSelection}>
          <X size={20} />
        </button>
        <span>{selectedMessages.length} seleccionados</span>
      </div>

      <div className="selection-right">
        {selectionType === "normal" && (
          <>
            <button onClick={handleDelete} disabled={deleting}>
              <Trash2 size={20} />
            </button>
            {selectedMessages.length === 1 && (
              <button
                onClick={() => {
                  setReplyingTo(selectedMessages[0]);
                  clearSelection();
                }}
              >
                <Forward size={20} />
              </button>
            )}

            {/* Solo debe ser visible cuando el elemento sea un documento, una imagen o un video */}
            {/* <button>
              <Download size={20} />
            </button> */}
          </>
        )}
        <>
          <button onClick={() => setForwardModalOpen(true)}>
            <SquareArrowOutUpRight size={20} />
          </button>
        </>
      </div>
    </div>
  );
};
