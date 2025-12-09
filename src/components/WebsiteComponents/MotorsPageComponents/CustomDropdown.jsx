"use client"
import { useState } from "react"

import { ChevronDown } from "lucide-react"

export default function CustomDropdown({ label, options, initialValue }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(initialValue || options[0])

  const handleSelect = (option) => {
    setSelectedValue(option)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-[#444] mb-2">{label}</label>
      <button
        type="button"
        className="w-full px-4 py-2  rounded-lg bg-[#FAFAFA] text-sm text-gray-700  transition flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        
        <span>{selectedValue}</span>
     <span
    className={`text-xs ml-2 transition-transform duration-200 leading-none text-[#175f48] ${isOpen ? "rotate-180" : ""}`}
  >
    ▼
  </span>
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
