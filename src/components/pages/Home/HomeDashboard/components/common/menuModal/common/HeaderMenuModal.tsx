import { X } from "lucide-react";
import type { HeaderModalProps } from "../../../../../../../../types/home/menuModal";

export const HeaderMenuModal = ({
  title = "Reenviar mensaje a",
  setFowardModalOpen,
}: HeaderModalProps) => {
  return (
    <header className="modal-header">
      <h3>{title}</h3>
      <button className="close-btn" onClick={setFowardModalOpen}>
        <X size={22} />
      </button>
    </header>
  );
};
