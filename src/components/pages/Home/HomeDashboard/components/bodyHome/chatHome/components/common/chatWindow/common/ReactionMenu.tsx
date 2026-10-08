import { useEffect, useRef } from "react";
import { useApiToken } from "../../../../../../../../../../../hooks/useApiToken";
import { config } from "../../../../../../../../../../../config/config";
import { Smile } from "lucide-react";
import { useReactionStore } from "../../../../../../../../../../../stores/homeStore";
import { useUpdateDocument } from "../../../../../../../../../../../functions/supabase/streaming/useUpdateDocument";
import type { ReactionMenuProps } from "../../../../../../../../../../../types";

//Emojis para la reaccion
const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const ReactionMenu = ({
  message,
  phone,
  currentReaction,
}: ReactionMenuProps) => {
  //Referencia para el menu
  const menuRef = useRef<HTMLDivElement>(null);

  //Funcion para llamar a la api
  const { postApiToken } = useApiToken();

  //Se obtiene el store para las reacciones
  const { updateLocalReaction, openMenuId, setOpenMenuId } = useReactionStore();

  //Se llama al hook para actualizar la base de datos
  const { updateDoc } = useUpdateDocument("messages");

  //Se obtiene y almacena cuando esta abierto y cuando esta cerrado el menu
  const isOpen = openMenuId === message.id;
  //Efecto para el click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpenMenuId]);

  //Se maneja la reaccion que se enviara
  const handleReact = async (emoji: string) => {
    setOpenMenuId(null);
    const finalEmoji = currentReaction === emoji ? null : emoji;

    updateLocalReaction(message.id, finalEmoji);
    const reactionTime = new Date().toISOString();
    try {
      await updateDoc(message.id, {
        reaction: finalEmoji,
        reaction_owner: "agent",
        reaction_time: reactionTime,
      });

      await postApiToken({
        url: "react-whatsapp",
        token: config.BEARER_TOKEN,
        body: {
          phone: phone,
          message_id: message.wa_id,
          emoji: finalEmoji || "",
        },
      });
    } catch (error) {
      console.error("Error al enviar reacción", error);
    }
  };

  return (
    <div className="reaction-menu-container" ref={menuRef}>
      <button
        className="react-action-btn"
        onClick={() => setOpenMenuId(isOpen ? null : message.id)}
      >
        <Smile size={16} />
      </button>

      {isOpen && (
        <div className="reaction-popover">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={`emoji-btn ${currentReaction === emoji ? "active" : ""}`}
              onClick={() => handleReact(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
