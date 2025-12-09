"use client"; // if using Next.js 13+/App Router

import { useState } from "react";

export default function CustomDropdown({ label, options }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-[#444] mb-2">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-lg bg-[#FAFAFA] text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition relative"
      >
        {selected}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#175f48] pointer-events-none">
          ▼
        </span>
      </div>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md text-sm">
          {options.map((opt, i) => (
            <li
              key={i}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
