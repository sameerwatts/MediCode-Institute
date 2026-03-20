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
  onImageUpload?: (file: File) => Promise<string>;
  editable?: boolean;
}

const TipTapEditor: React.FC<ITipTapEditorProps> = ({
  content,
  onUpdate,
  onImageUpload,
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
    immediatelyRender: false,
    editable,
    onUpdate: ({ editor: ed }) => {
      onUpdate?.(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !onImageUpload) return false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        event.preventDefault();
        onImageUpload(file).then((url) => {
          const { tr } = view.state;
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (pos) {
            const node = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(tr.insert(pos.pos, node));
          }
        });
        return true;
      },
      handlePaste: (view, event) => {
        if (!onImageUpload) return false;
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) return false;
            onImageUpload(file).then((url) => {
              const { tr, selection } = view.state;
              const node = view.state.schema.nodes.image.create({ src: url });
              view.dispatch(tr.insert(selection.from, node));
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  return (
    <div className="border border-light-gray rounded-xl bg-white overflow-hidden">
      {editable && (
        <TipTapToolbar editor={editor} onImageUpload={onImageUpload} />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
