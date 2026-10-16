import type { ReactNode } from "react";
import type { TemplateComponent } from "../../../../../../../../../../../../types/home/templateSectionTypes";

export type BodyComponentsProps = {
  bodyComponent: TemplateComponent | undefined;
  renderEditableText: (textObj?: TemplateComponent) => ReactNode[] | null;
};
export const BodyComponents = ({
  bodyComponent,
  renderEditableText,
}: BodyComponentsProps) => {
  return (
    <div className="markdown mark-template">
      <p className="template-body-text">{renderEditableText(bodyComponent)}</p>
    </div>
  );
};
