"use client";
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from '@tiptap/extension-text';
// import Placeholder from "@tiptap/extension-placeholder";
import styles from "./RichTextEditor.module.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-gray-50 border border-gray-200 rounded-t px-2 py-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-gray-300 font-bold" : ""
        }`}
        aria-label="Bold"
      >
        <b>B</b>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-300 font-bold" : ""
        }`}
        aria-label="Italic"
      >
        <i>I</i>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("underline") ? "bg-gray-300 font-bold" : ""
        }`}
        aria-label="Underline"
      >
        <u>U</u>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 })
            ? "bg-gray-300 font-bold"
            : ""
        }`}
        aria-label="Heading 1"
      >
        <span className="font-bold">H1</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 2 })
            ? "bg-gray-300 font-bold"
            : ""
        }`}
        aria-label="Heading 2"
      >
        <span className="font-bold">H2</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-300 font-bold" : ""
        }`}
        aria-label="Ordered List"
      >
        <span>1. List</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-300 font-bold" : ""
        }`}
        aria-label="Bullet List"
      >
        <span>&bull; List</span>
      </button>
    </div>
  );
};

function RichTextEditor({ value, onChange, error, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Text, 
      // Placeholder.configure({
      //   placeholder: placeholder || "Describe your item...",
      // }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML();
  console.log('HTML on update:', newHtml);
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          `${styles.richTextEditorContent} bg-white rounded-b border px-4 py-2 text-base focus:outline-none focus:ring focus:border-green-400 ` +
          (error
            ? "border-red-500 focus:border-red-500 focus:ring-red-400"
            : "border-gray-300"),
        spellcheck: "true",
      },
    },
  });

  // Keep editor content synced with external value
  const lastValue = useRef(value);
  useEffect(() => {
    if (editor && value !== lastValue.current) {
      editor.commands.setContent(value || "", false);
      lastValue.current = value;
    }
  }, [value, editor]);

  return (
    <div className={styles.richTextEditorWrapper}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
