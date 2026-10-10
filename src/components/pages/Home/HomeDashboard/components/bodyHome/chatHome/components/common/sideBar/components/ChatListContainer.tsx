import { BeatLoader } from "react-spinners";
import { useActiveChat } from "../../../../../../../../../../../stores/homeStore";
import type { ChatListProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useSupabaseCollection } from "../../../../../../../../../../../functions/supabase/streaming/useSupabaseCollection";
import { useDataChat } from "../../../../data/useDataChat";
import type { UserDataType } from "../../../../../../../../../../../types/home/dashboardTypes";
import { useUpdateDocument } from "../../../../../../../../../../../functions/supabase/streaming/useUpdateDocument";
import { useAuthStore } from "../../../../../../../../../../../stores/userStore";
import { SideBarContent } from "./SideBarContent";
import { useMemo } from "react";

export const ChatListContainer = ({
  filteredChats,
  menuOpen,
  openMenuId,
}: ChatListProps) => {
  //Se obtiene el chat activo
  const { activeChat, setActiveChat } = useActiveChat();

  //Se obtiene los datos del usuario
  const { data } = useSupabaseCollection<UserDataType>("users");

  //Se obtiene la data filtrada por usuario
  const staffOnlyUsers = useMemo(() => {
    return data.filter((user) => user.role !== "user");
  }, [data]);

  //Se obtienen los loaders de data chat
  const { chatsLoading, messagesLoader } = useDataChat();

  //Se obtienen los datos del staff
  const staffData: UserDataType[] = staffOnlyUsers || [];

  //Se obtiene el hook para actualizar el documento en la base de datos
  const { updateDoc } = useUpdateDocument("chat");

  //Se obtiene el usuario autentificado
  const { user } = useAuthStore();

  //Se obtiene el id del usuario
  const uid = user?.uuId;

  //Se almacena el loader
  const isLoading = chatsLoading || messagesLoader;

  return (
    <div className="chat-list">
      {filteredChats.map((chat) => {
        const hasAssingedStaff = chat.staff_id !== null;
        let isAssignedToCurrentUser = false;
        if (hasAssingedStaff) {
          if (chat.staff_id === uid) {
            isAssignedToCurrentUser = true;
          }
        }
        return (
          <SideBarContent
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChat}
            staffData={staffData}
            // No esta siendo usado de momento, se puede usar para resaltar los chats que tiene asigndo el usuario
            isAssignedToCurrentUser={isAssignedToCurrentUser}
            openMenuId={openMenuId}
            menuOpen={menuOpen}
            //Se usa para saber que usuario resaltar en el menu de asignar chat to staff
            chatId={chat.staff_id}
            onClick={() => {
              setActiveChat(chat.id);
              updateDoc(chat.id, {
                total_messages: 0,
                status: "Pendient",
                //Actualizamos el staff id para saber quien fue el ultimo asesor que interactuo con el usuario
                staff_id: uid,
              });
            }}
          />
        );
      })}
      {isLoading && (
        <div className="loader-card">
          <BeatLoader size={8} color="#85b6ff" />
        </div>
      )}
      {filteredChats.length === 0 && isLoading === false && (
        <div className="not-found-chats">Bandeja de mensajes vacía</div>
      )}
    </div>
  );
};
