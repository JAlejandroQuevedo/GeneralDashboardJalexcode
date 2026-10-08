import { useState } from "react";
import type { MouseEvent } from "react";
import type {
  ChatStatus,
  SideBarContentProps,
} from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useUpdateDocument } from "../../../../../../../../../../../functions/supabase/streaming/useUpdateDocument";
import { AsignButtonsDropdown } from "../common/AsignButtonsDropdown";
import { AsignStaffButtons } from "../common/AsignStaffButtons";
import { useDataChat } from "../../../../data/useDataChat";
import { MessageStatusIcon } from "../../chatWindow/common/MessageStatusIcon";
import {
  formatMessageTime,
  getInitials,
} from "../../../../../../../../../../../functions/helpersChat";
import { ChevronDown } from "lucide-react";
import { SideBarContentChats } from "../common/SideBarContentChats";
import { useDeleteChats } from "../../../../../../../../../../../hooks/useDeleteChats";
import { useUtilities } from "../../../../../../../../../../../hooks/useUtilities";

export const SideBarContent = ({
  chat,
  isActive,
  onClick,
  staffData,
  menuOpen,
  openMenuId,
  chatId,
}: SideBarContentProps) => {
  const [showStaffMenu, setShowStaffMenu] = useState(false);
  const { getLastActiveMessage } = useUtilities();
  const { updateDoc } = useUpdateDocument("chat");
  const isMenuOpen = openMenuId === chat.id;

  //Manejo del open del dropdown

  const handleMenuToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isMenuOpen) {
      menuOpen(null);
    } else {
      menuOpen(chat.id);
      setShowStaffMenu(false);
    }
  };

  //Manejo del cambio de estado del chat

  const handleChangeStatus = (
    e: MouseEvent<HTMLButtonElement>,
    status: ChatStatus,
  ) => {
    e.stopPropagation();
    updateDoc(chat.id, { status: status });
    menuOpen(null);
  };
  //Manejo del btn para abrir el menu para asignar el chat

  const handleAssignClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowStaffMenu(true);
  };

  //Manejo del btn para asignar el chat

  const handleAssignToStaff = (
    e: MouseEvent<HTMLButtonElement>,
    staffId: string,
  ) => {
    e.stopPropagation();
    updateDoc(chat.id, { staff_id: staffId });
    updateDoc(chat.id, { status: "Notstarted" });

    menuOpen(null);
    setShowStaffMenu(false);
  };
  //Manejo del btn para el back cuando esta el menu para asignar el chat a un staff

  const handleBackToMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowStaffMenu(false);
  };

  const { deleteChat, deleteMessages } = useDeleteChats();
  const { messages } = useDataChat();

  const messagesToChatId = messages.filter((m) => m.chat_id === chat.id);
  //Manejo para el btn de delete

  const handleDeleteBtn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const result = await deleteChat(chat.id, messagesToChatId);
    const resultMessages = await deleteMessages(messagesToChatId);
    if (!result.success || !resultMessages.success) {
      console.error("No se pudo eliminar el chat:", result.error);
    }
    menuOpen(null);
  };

  const handleCleanBtn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const resultMessages = await deleteMessages(messagesToChatId);
    if (!resultMessages.success) {
      console.error("No se pudo eliminar el chat:", resultMessages.error);
    }
    menuOpen(null);
  };
  //Extraccion los datos del ultimo mensaje enviado por el usuario

  const lastMessage = getLastActiveMessage(messages, chat.id);
  return (
    <div className={`chat-item ${isActive ? "active" : ""}`} onClick={onClick}>
      {/* Columna Izquierda: Avatar */}
      <div className="avatar">{getInitials(chat.name)}</div>

      {/* Columna Derecha: Contenido Principal */}
      <div className="chat-content">
        {/* Fila 1: Nombre, Hora y Menú */}
        <div className="chat-header">
          <div className="name-container">
            <div
              className={`status-dot ${chat.status.replace(" ", ".")}`}
              title={chat.status}
            />
            <span className="chat-name">{chat.name}</span>
          </div>

          <div className="header-actions">
            {lastMessage && (
              <span className="time">
                {formatMessageTime(lastMessage.created_at)}
              </span>
            )}
            <div className="menu-container">
              <button className="menu-btn" onClick={handleMenuToggle}>
                <ChevronDown size={15} />
              </button>
              {isMenuOpen && (
                <div className="dropdown">
                  {!showStaffMenu ? (
                    <AsignButtonsDropdown
                      handleChangeStatus={handleChangeStatus}
                      handleAssignClick={handleAssignClick}
                      handleDeleteBtn={handleDeleteBtn}
                      handleCleanBtn={handleCleanBtn}
                    />
                  ) : (
                    <AsignStaffButtons
                      staffId={chatId}
                      staffData={staffData}
                      handleAssignToStaff={handleAssignToStaff}
                      onBack={handleBackToMenu}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fila 2: Último mensaje y Contador */}
        <div className="chat-last-message">
          <div className="message-preview">
            {lastMessage && lastMessage.sender === "agent" && (
              <MessageStatusIcon status={lastMessage.status} />
            )}
            <SideBarContentChats chat={chat} message={lastMessage} />
          </div>

          {chat.total_messages > 0 && (
            <div className="unread-count">{chat.total_messages}</div>
          )}
        </div>
      </div>
    </div>
  );
};
