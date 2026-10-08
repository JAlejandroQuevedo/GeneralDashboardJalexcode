import { useShowLateralPanelStore } from "../../../../stores/homeStore";

export const TextButtonNavbar = () => {
  const { setisLateralPanelVisible, isLateralPanelVisible } =
    useShowLateralPanelStore();
  return (
    <section className="txt-button-navbar">
      <button
        onClick={() => {
          setisLateralPanelVisible(!isLateralPanelVisible);
        }}
        className="button-txt"
      >
        <img
          src="/img/icons/lateral_bar_icon.svg"
          alt="Icono de barra lateral"
        />
      </button>
      <div className="txt-navbar">
        <h3>Panel de Control</h3>
        <p>Dashboard de JAlexcode</p>
      </div>
    </section>
  );
};
