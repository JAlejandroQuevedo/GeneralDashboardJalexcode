import { useState, useRef, useEffect, type CSSProperties } from "react";
import {
  ChevronDown,
  Reply,
  CheckSquare,
  Trash2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useChatUIStore } from "../../../../../../../../../../../stores/homeStore";
import { useDeleteChats } from "../../../../../../../../../../../hooks/useDeleteChats";
import type { MessageMenuProps } from "../../../../../../../../../../../types";

export const MessageMenu = ({
  message,
  isLast,
  color = "",
  bgc,
  canIReply = true,
}: MessageMenuProps) => {
  //State y ref que maneja la interfaz del componente
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  //Se llama al store del UI
  const {
    setReplyingTo,
    toggleMessageSelection,
    setDeletingIds,
    initiateForward,
  } = useChatUIStore();

  //Se llama al hook para eliminar los mensajes de la db
  const { deleteMessages } = useDeleteChats();

  //Efecto para el manejo de clicks outside del menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Handle segun la accion e la lista del menu
  const handleAction = async (action: string) => {
    setIsOpen(false);
    if (action === "reply") setReplyingTo(message);
    if (action === "select") toggleMessageSelection(message);
    if (action === "delete") {
      setDeletingIds([message.id]);
      await deleteMessages([message]);
      setDeletingIds([]);
    }
    if (action === "resend") initiateForward(message);
  };

  return (
    <div
      style={
        {
          "--dynamic-bg": bgc,
        } as CSSProperties
      }
      className="message-menu-container"
      ref={menuRef}
    >
      <button className="menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <ChevronDown color={color} size={18} />
      </button>

      {isOpen && (
        <ul className={`dropdown-menu ${isLast ? "drop-up" : ""}`}>
          {canIReply && (
            <li onClick={() => handleAction("reply")}>
              <Reply size={16} /> Responder
            </li>
          )}
          <li onClick={() => handleAction("resend")}>
            <SquareArrowOutUpRight size={16} /> Reenviar
          </li>
          <li onClick={() => handleAction("select")}>
            <CheckSquare size={16} /> Seleccionar
          </li>

          <li className="danger" onClick={() => handleAction("delete")}>
            <Trash2 size={16} /> Eliminar
          </li>
        </ul>
      )}
    </div>
  );
};
