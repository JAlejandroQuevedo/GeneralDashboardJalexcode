import { type RefObject } from "react";
import { Bold, Italic, Strikethrough, Code, List } from "lucide-react"; // O los iconos que uses
import type { SmartEditorRef } from "../../../../../../../../../../../types/form/inputsType";

export type MarkdownToolbarProps = {
  editorRef: RefObject<SmartEditorRef | null>;
};

export const MarkdownToolbar = ({ editorRef }: MarkdownToolbarProps) => {
  return (
    <div className="markdown-toolbar">
      <button
        type="button"
        className="format-btn"
        onClick={() => editorRef.current?.toggleBold()}
        title="Negrita"
      >
        <Bold color="#54656f" size={18} />
      </button>

      <button
        type="button"
        className="format-btn"
        onClick={() => editorRef.current?.toggleItalic()}
        title="Cursiva"
      >
        <Italic color="#54656f" size={18} />
      </button>

      <button
        type="button"
        className="format-btn"
        onClick={() => editorRef.current?.toggleStrike()}
        title="Tachado"
      >
        <Strikethrough color="#54656f" size={18} />
      </button>

      <button
        type="button"
        className="format-btn"
        onClick={() => editorRef.current?.toggleCode()}
        title="Código"
      >
        <Code color="#54656f" size={18} />
      </button>

      {/* Opcional: El de lista por si lo necesitas a la mano */}
      <button
        type="button"
        className="format-btn"
        onClick={() => editorRef.current?.toggleBulletList()}
        title="Lista de viñetas"
      >
        <List color="#54656f" size={18} />
      </button>
    </div>
  );
};
