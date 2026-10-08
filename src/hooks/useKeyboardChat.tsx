import { useEffect } from "react";
import { useActiveChat } from "../stores/homeStore";

export const useKeyboardChat = () => {
  //Manejo de envio mediante tecla escape para cerrar el chat activo
  const { setActiveChat } = useActiveChat();
  useEffect(() => {
    const handleGlobalKeyDown = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        setActiveChat("");
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [setActiveChat]);
};
