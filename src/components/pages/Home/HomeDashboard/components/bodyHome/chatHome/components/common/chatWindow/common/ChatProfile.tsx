import { ChevronLeft } from "lucide-react";
import { useActiveChat } from "../../../../../../../../../../../stores/homeStore";
import type { ChatProfileContainerProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { getInitials } from "../../../../../../../../../../../functions/helpersChat";
import { useDataChat } from "../../../../data/useDataChat";
import { useUtilities } from "../../../../../../../../../../../hooks/useUtilities";

export const ChatProfile = ({ chat }: ChatProfileContainerProps) => {
  //Store global que guarda el chat activo
  const { getRelativeTime, formatPhoneNumber } = useUtilities();
  const { setActiveChat } = useActiveChat();
  const { messages } = useDataChat();
  const lastMessage = messages.filter((m) => m.chat_id === chat.id).at(-1);
  lastMessage?.created_at;
  return (
    <>
      {chat !== undefined && (
        <div className="profile-container">
          <button
            onClick={() => {
              setActiveChat("");
            }}
          >
            <ChevronLeft color="#2b7fff" />
          </button>
          <div className="bubble-avatar">{getInitials(chat.name)}</div>
          <div className="txt-container-messages">
            <div className="contact-info">
              <h3>{chat.name}</h3>
              <h4>({formatPhoneNumber(chat.bsuid)})</h4>
            </div>
            <p>{getRelativeTime(lastMessage?.created_at)}</p>
          </div>
        </div>
      )}
    </>
  );
};
