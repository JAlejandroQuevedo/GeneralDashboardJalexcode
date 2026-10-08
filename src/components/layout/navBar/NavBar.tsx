import { useState } from "react";
import { DropDownMenuNavbar } from "./components/DropDownMenuNavbar";
import { TextButtonNavbar } from "./components/TextButtonNavbar";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <TextButtonNavbar />

      <div className="dropdown-container">
        <button className="dropdown-button" onClick={toggleMenu}>
          <img
            src="/img/icons/logo_shield.svg"
            alt="Icono del escudo del logo"
          />
        </button>
        {isMenuOpen && <DropDownMenuNavbar />}
      </div>
    </nav>
  );
};
