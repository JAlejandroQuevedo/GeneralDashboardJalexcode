import type { CSSProperties } from "react";
import type { ErrorCreateChatTypeProps } from "../../../../../../../../../../../../../../types";

export const ErrorCreateChat = ({ error }: ErrorCreateChatTypeProps) => {
  return (
    <>
      {error ? (
        <div
          style={{ "--dinamic-align": "center" } as CSSProperties}
          className="form-inputs-container-chat"
        >
          <div className="error-container">
            <img src="/img/icons/warning_icon.svg" alt="" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
