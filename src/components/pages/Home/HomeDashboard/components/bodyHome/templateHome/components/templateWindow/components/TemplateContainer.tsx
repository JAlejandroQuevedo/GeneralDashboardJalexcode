import type {
  TemplateComponent,
  TemplateContainerProps,
} from "../../../../../../../../../../types/home/templateSectionTypes";

import { InputTemplate } from "./common/InputTemplate";
import { LinesTemplate } from "./common/LinesTemplate";
import { ImageHeaderComponent } from "./common/headerComponents/ImageHeaderComponent";
import { TextHeaderComponent } from "./common/headerComponents/TextHeaderComponent";
import { BodyComponents } from "./common/bodyComponents/BodyComponents";
import { ButtonsComponents } from "./common/buttonsComponents/ButtonsComponents";

export const TemplateContainer = ({
  register,
  watch,
  setValue,
  headerComponent,
  bodyComponent,
  buttonsComponent,
  errors,
  fileInputRef,
  selectedFile,
  selectedFilePreview,
  template,
}: TemplateContainerProps) => {
  // Función mágica: Renderiza texto con inputs anidados usando `register`
  const renderEditableText = (textObj?: TemplateComponent) => {
    if (!textObj || !textObj.text) return null;

    const parts = textObj.text.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/^\{\{(.+)\}\}$/);

      if (match) {
        const varName = match[1].trim();
        const placeholderStr = textObj.placeholders?.[varName] || varName;

        // Observamos el valor actual para calcular el ancho dinámico
        const currentValue = (watch(varName) as string) || "";
        const inputLength = Math.max(
          placeholderStr.length,
          typeof currentValue === "string" ? currentValue.length : 0,
        );

        // Verificamos si hay error en este campo
        const hasError = !!errors[varName];
        return (
          <InputTemplate
            key={`input-${varName}-${index}`}
            register={register}
            placeholderStr={placeholderStr}
            varName={varName}
            inputLength={inputLength}
            hasError={hasError}
          />
        );
      }
      const lines = part.split(/\\n|\n/);

      return <LinesTemplate key={`text-part-${index}`} lines={lines} />;
    });
  };
  return (
    <div className="chat-container template-flex-1">
      <div className="message-row agent">
        <div className="message-bubble agent template">
          <header>
            <ul>
              <li>Tu plantilla</li>
            </ul>
          </header>
          {/* RENDER HEADER (IMAGEN INTERACTIVA) */}
          {headerComponent?.format === "IMAGE" && (
            <ImageHeaderComponent
              onClick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              errors={errors}
              template={template}
              setValue={setValue}
              selectedFile={selectedFile}
              selectedFilePreview={selectedFilePreview}
              headerComponent={headerComponent}
            />
          )}
          {/* RENDER HEADER (TEXTO INTERACTIVO) */}
          {headerComponent?.format === "TEXT" && (
            <TextHeaderComponent
              renderEditableText={renderEditableText}
              headerComponent={headerComponent}
            />
          )}
          {/* RENDER BODY (TEXTO INTERACTIVO) */}
          <BodyComponents
            bodyComponent={bodyComponent}
            renderEditableText={renderEditableText}
          />
          {/* RENDER BOTONES */}

          <ButtonsComponents buttonsComponent={buttonsComponent} />
        </div>
      </div>
    </div>
  );
};
