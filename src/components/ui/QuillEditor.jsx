"use client";
import React, { useEffect, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function QuillEditor({ value, onChange, error, placeholder }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  }), []);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list",
    "link"
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Describe your item..."}
        className={`bg-white rounded-md border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:none `}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
