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
import type { JSONContent } from "@tiptap/react";

const lowlight = createLowlight(common);

interface ITipTapRendererProps {
  content: JSONContent | null;
}

const TipTapRenderer: React.FC<ITipTapRendererProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4",
      },
    },
  });

  if (!content) {
    return (
      <p className="text-sm-text text-dark-gray py-8 text-center">
        No content available for this lesson yet.
      </p>
    );
  }

  return <EditorContent editor={editor} />;
};

export default TipTapRenderer;
