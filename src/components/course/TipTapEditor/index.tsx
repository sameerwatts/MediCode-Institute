"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { common, createLowlight } from "lowlight";
import TipTapToolbar from "./TipTapToolbar";
import type { JSONContent } from "@tiptap/react";

const lowlight = createLowlight(common);

export interface ITipTapEditorProps {
  content: JSONContent | null;
  onUpdate?: (content: JSONContent) => void;
  editable?: boolean;
}

const TipTapEditor: React.FC<ITipTapEditorProps> = ({
  content,
  onUpdate,
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    editable,
    onUpdate: ({ editor: ed }) => {
      onUpdate?.(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  return (
    <div className="border border-light-gray rounded-xl bg-white overflow-hidden">
      {editable && <TipTapToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
