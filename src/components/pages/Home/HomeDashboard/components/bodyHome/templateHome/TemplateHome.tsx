import { useState, type CSSProperties } from "react";
import { TemplatePreviewWindow } from "./components/templateWindow/TemplatePreviewWindow";
import { TemplateSideBar } from "./components/sideBar/TemplateSideBar";
import { STATIC_TEMPLATES } from "./data/mockTemplates";
import { useResponsive } from "../../../../../../../constants/reactResponsive";
import type { TemplateType } from "../../../../../../../types/home/templateSectionTypes";
import { useTemplateUIStore } from "../../../../../../../stores/homeStore";
import { MenuModal } from "../../common/menuModal/MenuModal";

export const TemplateHome = () => {
  const [activeTemplate, setActiveTemplate] = useState<any | null>(null);

  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  const hasActiveTemplate = activeTemplate !== null;
  const {
    setEndpoint,
    setNormalizedVariables,
    setSelectedFile,
    setMenuModalOpen,
  } = useTemplateUIStore();
  // Función para manejar el envío a Meta
  const handleSendTemplate = async (
    endpoint: string,
    normalizedVariables: Record<string, string>,
    selectedFile: File | null,
  ) => {
    setEndpoint(endpoint);
    setNormalizedVariables(normalizedVariables);
    setSelectedFile(selectedFile);
    setMenuModalOpen(true);
  };

  return (
    <section className="chat-layout">
      {(!isSmall || !hasActiveTemplate) && (
        <TemplateSideBar
          templates={STATIC_TEMPLATES}
          activeTemplateId={activeTemplate?.id}
          onSelect={(tpl: TemplateType) => {
            setActiveTemplate(tpl);
          }}
        />
      )}
      {(!isSmall || hasActiveTemplate) && (
        <main
          style={
            {
              "--dynamic-background": hasActiveTemplate
                ? "url(https://res.cloudinary.com/dcgup4dzv/image/upload/v1791446521/bck_chat_slwcd4.jpg)"
                : "none",
              "--dynamic-background-color": !hasActiveTemplate
                ? "#F7F5F3"
                : "none",
            } as CSSProperties
          }
          className="chat-window"
        >
          {hasActiveTemplate ? (
            <TemplatePreviewWindow
              template={activeTemplate}
              onSend={handleSendTemplate}
            />
          ) : (
            <div className="inactive-chat-window">
              <div className="container-inactive-window-content">
                <img src="/img/icons/logo_shield.svg" alt="" />
                <p>Selecciona una plantilla para previsualizarla</p>
              </div>
            </div>
          )}
        </main>
      )}
      <MenuModal type="Template" />
    </section>
  );
};
