import { Bold, Italic, Strikethrough, Code, List } from "lucide-react"; // O los iconos que uses
import type { MarkdownToolbarProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { useEffect, useState, type MouseEvent } from "react";

export const MarkdownToolbar = ({ editorRef }: MarkdownToolbarProps) => {
  const keepFocus = (e: MouseEvent) => e.preventDefault();

  // Guardamos en un objeto el state, para saber que elemento esta activo y cual esta inactivo

  const [activeTools, setActiveTools] = useState({
    bold: false,
    italics: false,
    crossed: false,
    code: false,
    list: false,
  });

  useEffect(() => {
    // Timeout para asegurar de que SmartTextArea ya terminó de cargar el ref
    const timer = setTimeout(() => {
      // Se obtiene la instancia real de TipTap
      const editor = (editorRef.current as any)?.getEditor?.();

      if (editor) {
        //Función que lee la realidad de TipTap y pinta cambia de estado los botones
        const updateToolbar = () => {
          setActiveTools({
            bold: editor.isActive("bold"),
            italics: editor.isActive("italic"),
            crossed: editor.isActive("strike"),
            code: editor.isActive("code"),
            list: editor.isActive("bulletList"),
          });
        };

        // Escuchamos cualquier cambio en el cursor, selección o texto
        editor.on("transaction", updateToolbar);

        // Actualización inicial
        updateToolbar();

        // Limpieza del listener al desmontar
        return () => {
          editor.off("transaction", updateToolbar);
        };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [editorRef]);

  return (
    <div className="markdown-toolbar">
      <button
        type="button"
        className="format-btn"
        onMouseDown={keepFocus}
        onClick={() => editorRef.current?.toggleBold()}
        title="Negrita"
      >
        <Bold
          color={activeTools.bold ? "#2b7fff" : "#54656f"}
          size={activeTools.bold ? 20 : 18}
        />
      </button>

      <button
        type="button"
        className="format-btn"
        onMouseDown={keepFocus}
        onClick={() => editorRef.current?.toggleItalic()}
        title="Cursiva"
      >
        <Italic
          color={activeTools.italics ? "#2b7fff" : "#54656f"}
          size={activeTools.italics ? 20 : 18}
        />
      </button>

      <button
        type="button"
        className="format-btn"
        onMouseDown={keepFocus}
        onClick={() => editorRef.current?.toggleStrike()}
        title="Tachado"
      >
        <Strikethrough
          color={activeTools.crossed ? "#2b7fff" : "#54656f"}
          size={activeTools.crossed ? 20 : 18}
        />
      </button>

      <button
        type="button"
        className="format-btn"
        onMouseDown={keepFocus}
        onClick={() => editorRef.current?.toggleCode()}
        title="Código"
      >
        <Code
          color={activeTools.code ? "#2b7fff" : "#54656f"}
          size={activeTools.code ? 20 : 18}
        />
      </button>

      <button
        type="button"
        className="format-btn"
        onMouseDown={keepFocus}
        onClick={() => editorRef.current?.toggleBulletList()}
        title="Lista de viñetas"
      >
        <List
          color={activeTools.list ? "#2b7fff" : "#54656f"}
          size={activeTools.list ? 20 : 18}
        />
      </button>
    </div>
  );
};
