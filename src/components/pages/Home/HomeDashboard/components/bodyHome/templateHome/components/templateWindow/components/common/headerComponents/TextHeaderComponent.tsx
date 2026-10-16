import type { TextHeaderComponentProps } from "../../../../../../../../../../../../types/home/templateSectionTypes";

export const TextHeaderComponent = ({
  headerComponent,
  renderEditableText,
}: TextHeaderComponentProps) => {
  return (
    <div className="template-text-header">
      {renderEditableText(headerComponent)}
    </div>
  );
};
