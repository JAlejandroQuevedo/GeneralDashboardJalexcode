import { useDeleteDocument } from "../functions/supabase/streaming/useDeleteDocument";
import { clearMediaCache } from "../functions/cacheUtils";
import { useUpdateDocument } from "../functions/supabase/streaming/useUpdateDocument";

export const useDeleteChats = () => {
  const { deleteDoc, deleting, deleteError } = useDeleteDocument("messages");
  const { updateDoc: updateChat } = useUpdateDocument("chat");

  const deleteMessages = async (messages: any[], chatId?: string) => {
    if (!messages || messages.length === 0) return { success: true };

    // Extraemos los IDs
    const messageIds = messages.map((msg) => msg.id);

    //  Usamos el hook de delete doc
    const result = await deleteDoc(messageIds);

    // Si se borraron en BD, limpiamos la caché del navegador
    if (result.success) {
      if (chatId) {
        await updateChat(chatId, { total_messages: 0 });
      }

      await clearMediaCache(messages, "whatsapp-media-cache-v1");
    }

    return result;
  };

  // Apuntamos a la tabla 'chat'
  const {
    deleteDoc: deleteDocChat,
    deleting: deletingChat,
    deleteError: deleteChatError,
  } = useDeleteDocument("chat");

  // Recibe el ID del chat y los mensajes que tiene cargados en pantalla para limpiar su caché
  const deleteChat = async (chatId: string, currentMessages: any[]) => {
    // 1. Borramos el chat (Supabase eliminará los mensajes automáticamente por el CASCADE)
    const result = await deleteDocChat(chatId);

    // 2. Si fue exitoso, limpiamos todas las imágenes/archivos cacheados de esos mensajes
    if (result.success && currentMessages.length > 0) {
      await clearMediaCache(currentMessages, "whatsapp-media-cache-v1");
    }

    return result;
  };

  return {
    deleteMessages,
    deleting,
    deleteError,
    deleteChat,
    deletingChat,
    deleteChatError,
  };
};
