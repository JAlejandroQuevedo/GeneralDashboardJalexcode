import type { ChatWindowProps } from "../../../../../../../../../../types/home/chatSectionTypes";
import { ChatContainer } from "./common/ChatContainer";
import { ChatProfile } from "./common/ChatProfile";
import { ForwardModal } from "./common/FowardModal";

export const ChatWindow = ({ messages, chat }: ChatWindowProps) => {
  return (
    <div className="messages-container">
      <ChatProfile chat={chat} />
      <ChatContainer messages={messages} />
      <ForwardModal />
    </div>
  );
};
