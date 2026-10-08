import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
} from "react";
import type {
  SmartEditorRef,
  SmartTextAreaProps,
} from "../../../../types/form/inputsType";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

export const SmartTextArea = forwardRef<SmartEditorRef, SmartTextAreaProps>(
  (
    {
      label,
      id,
      placeholder,
      value,
      onChange,
      disabled,
      width,
      height,
      onKeyDownTextArea,
    },
    ref,
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: false }),
        Placeholder.configure({
          placeholder: placeholder || "Escribe un mensaje...",
        }),
        Markdown.configure({
          html: false, // Mantiene la salida limpia de HTML
          transformPastedText: true, // Convierte texto pegado a Markdown
          transformCopiedText: true,
          breaks: true, // Usa saltos de línea duros (\n) sin poner '\' al final
        }),
      ],

      content: value,
      editable: !disabled,
      editorProps: {
        // Agregamos el guion bajo a _view
        handleKeyDown: (_view, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            // Si el usuario está en una lista, permitimos que Enter cree una nueva viñeta
            if (
              editor.isActive("bulletList") ||
              editor.isActive("orderedList")
            ) {
              return false; // TipTap se encarga de crear el siguiente <li>
            }

            // Si NO está en una lista, Enter envía el mensaje
            event.preventDefault();
            if (onKeyDownTextArea) onKeyDownTextArea(event);
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        const markdownStorage = editor.storage as typeof editor.storage & {
          markdown: { getMarkdown: () => string };
        };
        onChange(markdownStorage.markdown.getMarkdown());
      },
    });

    // 3. Exponemos los comandos nativos de TipTap hacia la referencia
    useImperativeHandle(ref, () => ({
      toggleBold: () => editor?.chain().focus().toggleBold().run(),
      toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
      toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
      toggleCode: () => editor?.chain().focus().toggleCode().run(),
      toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
      insertEmoji: (emoji: string) =>
        editor?.chain().focus().insertContent(emoji).run(),
    }));

    useEffect(() => {
      if (
        editor &&
        !value &&
        (
          editor.storage as typeof editor.storage & {
            markdown: { getMarkdown: () => string };
          }
        ).markdown
          .getMarkdown()
          .trim() !== ""
      ) {
        editor.commands.clearContent();
      }
    }, [value, editor]);

    return (
      <div className="smart-chat-container">
        {label && (
          <label className="labelText" htmlFor={id}>
            {label}
          </label>
        )}
        <div
          id={id}
          style={
            {
              ...(width ? { ["--w" as any]: width } : {}),
              ...(height ? { ["--h" as any]: height } : {}),
            } as CSSProperties
          }
          className={`smart-chat-editor ${disabled ? "disabled" : ""}`}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);

SmartTextArea.displayName = "SmartTextArea";
