import { useState } from "react";
import { SearchContainer } from "../search/SearchContainer";
import { useDataChat } from "../../../data/useDataChat";
import type { ChatType } from "../../../../../../../../../../types/home/chatSectionTypes";
import { ChatListContainer } from "./components/ChatListContainer";

export const SideBar = () => {
  const { chats } = useDataChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const filteredChats: ChatType[] = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.bsuid.includes(searchTerm),
  );

  return (
    <aside
      onClick={() => {
        setOpenMenuId(null);
      }}
      className="sidebar"
    >
      <SearchContainer searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ChatListContainer
        filteredChats={filteredChats}
        openMenuId={openMenuId}
        menuOpen={setOpenMenuId}
      />
    </aside>
  );
};
