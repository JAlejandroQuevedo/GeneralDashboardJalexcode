import { config } from "../../../../../../../../config/config";
import { useFilteredData } from "../../../../../../../../functions/filteredData";
import { useSupabaseCollection } from "../../../../../../../../functions/supabase/streaming/useSupabaseCollection";
import { useAuthStore } from "../../../../../../../../stores/userStore";

import type {
  ChatType,
  MessageType,
} from "../../../../../../../../types/home/chatSectionTypes";

export const useDataChat = () => {
  //Datos del usuario
  const { user: userData } = useAuthStore();
  //Filtros de usuarios de desarrollo
  const { filteredData } = useFilteredData();
  //Chats data
  const restrictedIdChats: string[] = [
    config.ID_DEV_CHAT,
    config.DEV_USER_ADMIN,
    config.ID_DEV_USER,
  ];

  const { data: normalData, loading: chatsLoading } =
    useSupabaseCollection<ChatType>("chat");
  const dataChats = filteredData(
    normalData,
    restrictedIdChats,
    userData?.uuId || "",
    "id",
  );
  //Messages Data
  const {
    data: dataMessages,
    loading: messagesLoader,
    isDisconnected: disconnectedMessage,
    reconnect: reconnectMessages,
  } = useSupabaseCollection<MessageType>("messages");

  //Data de chats y messages

  const chats: ChatType[] = dataChats || [];

  const messages: MessageType[] = dataMessages || [];
  return {
    chats,
    messages,
    chatsLoading,
    messagesLoader,
    disconnectedMessage,
    reconnectMessages,
  };
};
