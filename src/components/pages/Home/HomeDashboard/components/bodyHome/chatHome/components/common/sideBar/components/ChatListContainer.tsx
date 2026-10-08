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
  const { activeChat, setActiveChat } = useActiveChat();
  const { data } = useSupabaseCollection<UserDataType>("users");
  const staffOnlyUsers = useMemo(() => {
    return data.filter((user) => user.role !== "user");
  }, [data]);
  const { chatsLoading, messagesLoader } = useDataChat();
  const staffData: UserDataType[] = staffOnlyUsers || [];
  const { updateDoc } = useUpdateDocument("chat");
  const { user } = useAuthStore();
  const uid = user?.uuId;
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
            isAssignedToCurrentUser={isAssignedToCurrentUser}
            openMenuId={openMenuId}
            menuOpen={menuOpen}
            chatId={chat.staff_id}
            onClick={() => {
              setActiveChat(chat.id);
              updateDoc(chat.id, { total_messages: 0 });
              updateDoc(chat.id, { status: "Pendient" });
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
