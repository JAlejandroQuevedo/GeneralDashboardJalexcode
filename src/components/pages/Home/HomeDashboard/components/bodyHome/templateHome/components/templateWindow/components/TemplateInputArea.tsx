import { BeatLoader } from "react-spinners";
import { useTemplateUIStore } from "../../../../../../../../../../stores/homeStore";
import { SendButton } from "../../../../chatHome/components/common/formChat/buttons/SendButton";
import type { CSSProperties } from "react";

export type TemplateInputAreaProps = {
  isSubmitting: boolean;
};

export const TemplateInputArea = ({ isSubmitting }: TemplateInputAreaProps) => {
  const { isTemplateLoading } = useTemplateUIStore();

  return (
    <div className="chat-input-area">
      <div
        style={
          {
            "--dinamic-justify-content": isTemplateLoading
              ? "center"
              : "flex-end",
          } as CSSProperties
        }
        className="chat-input-form btn-template"
      >
        {isTemplateLoading ? (
          <BeatLoader size={10} color="#2b7fff" />
        ) : (
          <div className="btn-containers">
            <SendButton
              isSubmiting={isSubmitting}
              isButtonDisabled={false}
              isChatDisabled={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
