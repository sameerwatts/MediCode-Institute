"use client";

import React from "react";
import { Editor } from "@tiptap/react";

interface ITipTapToolbarProps {
  editor: Editor | null;
}

interface IToolbarButton {
  label: string;
  action: () => void;
  isActive: boolean;
}

const TipTapToolbar: React.FC<ITipTapToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const buttons: IToolbarButton[] = [
    {
      label: "B",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      label: "I",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
  ];

  const blockButtons: IToolbarButton[] = [
    {
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      label: "Bullet",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      label: "Ordered",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
  ];

  const tableButtons: IToolbarButton[] = [
    {
      label: "Table",
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      isActive: editor.isActive("table"),
    },
  ];

  const insertImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btnClass = (active: boolean) =>
    `px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
      active
        ? "bg-primary text-white"
        : "bg-white text-dark-gray border border-light-gray hover:bg-light"
    }`;

  return (
    <div
      className="flex flex-wrap gap-1.5 p-3 border-b border-light-gray bg-light/50 rounded-t-xl"
      role="toolbar"
      aria-label="Text formatting"
    >
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={btnClass(btn.isActive)}
          title={btn.label}
        >
          {btn.label}
        </button>
      ))}

      <span className="w-px h-6 bg-light-gray self-center mx-1" />

      {blockButtons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={btnClass(btn.isActive)}
          title={btn.label}
        >
          {btn.label}
        </button>
      ))}

      <span className="w-px h-6 bg-light-gray self-center mx-1" />

      {tableButtons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={btnClass(btn.isActive)}
          title={btn.label}
        >
          {btn.label}
        </button>
      ))}

      <button
        type="button"
        onClick={insertImage}
        className={btnClass(false)}
        title="Insert Image"
      >
        Image
      </button>

      <span className="w-px h-6 bg-light-gray self-center mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="Horizontal Rule"
      >
        HR
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnClass(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Undo"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnClass(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Redo"
      >
        Redo
      </button>
    </div>
  );
};

export default TipTapToolbar;
