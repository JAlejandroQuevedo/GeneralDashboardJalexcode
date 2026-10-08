import type { CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useResponsive } from "../../../../constants/reactResponsive";
import type { PopupProps } from "../../../../types";

export const Popup = ({
  title,
  children,
  isOpen,
  onClose,
  width,
  height,
  disableCloseOnOverlay = true,
  disableCloseOnEsc = false,
}: PopupProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  const { isSm, isMd, isLg } = useResponsive();
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="popup-overlay" />
        <Dialog.Content
          className="popup-container"
          style={
            {
              "--dinamic-width": width ? width : "90%",
              "--dinamic-height": height ? height : "70dvh",
            } as CSSProperties
          }
          aria-describedby={undefined}
          onPointerDownOutside={(e) => {
            if (disableCloseOnOverlay && !isSm && !isMd && !isLg) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (disableCloseOnEsc) {
              e.preventDefault();
            }
          }}
        >
          <div className="popup-header">
            <Dialog.Title asChild>
              {title ? <h2>{title}</h2> : <div />}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="popup-close" aria-label="Cerrar">
                <img
                  className="iconClose"
                  src="/img/icons/iconClose.svg"
                  alt="Icono de cierre de popup"
                />
              </button>
            </Dialog.Close>
          </div>

          <div className="popup-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
