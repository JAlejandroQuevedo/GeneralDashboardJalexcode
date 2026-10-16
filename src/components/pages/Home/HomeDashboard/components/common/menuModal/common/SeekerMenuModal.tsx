import { Search } from "lucide-react";
import type { SeekerMenuModalProps } from "../../../../../../../../types/home/menuModal";

export const SeekerMenuModal = ({
  searchTerm,
  onChange,
}: SeekerMenuModalProps) => {
  return (
    <div className="modal-search-container">
      <div className="search-input-wrapper">
        <Search color="#54656f" size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar nombre de contacto"
          value={searchTerm}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
