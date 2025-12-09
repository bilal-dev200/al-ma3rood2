"use client";
import { useState, useRef, useEffect } from "react";

const MoreOptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#175f48] hover:text-blue-600 text-sm flex items-center"
      >
        More Options
        <span className="ml-1 text-[#175f48]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md z-10 w-full ">
          <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Option 1
          </a>
          <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
            Option 2
          </a>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsDropdown;
