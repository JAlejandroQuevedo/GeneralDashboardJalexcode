import { ResendIcon } from "../../../../../../../../../../../../constants/icons/Icons";
import type {
  ButtonComponentsProps,
  TemplateButton,
} from "../../../../../../../../../../../../types/home/templateSectionTypes";

export const ButtonsComponents = ({
  buttonsComponent,
}: ButtonComponentsProps) => {
  return (
    <div className="btns-containers">
      {buttonsComponent?.buttons?.map((btn: TemplateButton, index: number) => (
        <div key={index} className="template-button-item">
          <ResendIcon size={15} color="#008BCC" />
          <p>{btn.text}</p>
        </div>
      ))}
    </div>
  );
};
