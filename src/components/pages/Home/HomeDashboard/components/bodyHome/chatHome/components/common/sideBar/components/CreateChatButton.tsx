import { useShowPopupCreateChat } from "../../../../../../../../../../../stores/homeStore";

export const CreateChatButton = () => {
  const { setisPopupVisible } = useShowPopupCreateChat();
  return (
    <div className="create-chat-button-container">
      <button
        onClick={() => {
          setisPopupVisible(true);
        }}
        aria-label="Nuevo chat"
        className="create-chat-button"
      >
        <img
          src="/img/icons/chat_add.svg"
          alt="Icono del chat con un signo + en el medio"
        />
      </button>
    </div>
  );
};
