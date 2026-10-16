import { Fragment } from "react/jsx-runtime";
import type { LinesTemplateProps } from "../../../../../../../../../../../types/home/templateSectionTypes";

export const LinesTemplate = ({ lines }: LinesTemplateProps) => {
  return (
    <span>
      {lines.map((line, lineIndex) => (
        <Fragment key={`text-part-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
};
