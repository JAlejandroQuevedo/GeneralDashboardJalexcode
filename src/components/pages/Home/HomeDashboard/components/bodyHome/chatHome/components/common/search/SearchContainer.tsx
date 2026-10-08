import { MessageCirclePlus } from "lucide-react";
import {
  useLoaderReconnectStore,
  useShowPopupCreateChat,
} from "../../../../../../../../../../stores/homeStore";
import type { SearchContainerProps } from "../../../../../../../../../../types/home/chatSectionTypes";
import { useDataChat } from "../../../data/useDataChat";

export const SearchContainer = ({
  searchTerm,
  setSearchTerm,
}: SearchContainerProps) => {
  //Store para el loader del reconect global
  const { setisLoaderActive } = useLoaderReconnectStore();

  //Recconect del chat
  const { reconnectMessages } = useDataChat();

  //Funcion que maneja el reconect

  const handleReload = () => {
    setisLoaderActive(true);
    setTimeout(() => {
      reconnectMessages();
      setisLoaderActive(false);
    }, 1200);
  };
  const { setisPopupVisible } = useShowPopupCreateChat();

  return (
    <div className="search-container">
      <div className="txt-search-container">
        <h3>Chats</h3>
        <div className="btn-search-container">
          <MessageCirclePlus
            onClick={() => {
              setisPopupVisible(true);
            }}
            cursor={"pointer"}
            color={"#959595"}
            size={25}
          />
          <button
            aria-label="Recargar chats"
            onClick={() => {
              handleReload();
            }}
          >
            <img src="/img/icons/reload_icon.svg" alt="Icono de reload" />
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Buscar conversaciones..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
