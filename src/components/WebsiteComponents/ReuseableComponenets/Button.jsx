import React from "react";

const Button = ({ title, onClick, className = "", children, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 w-44 rounded-[10px] border border-green-500 text-green-500 bg-white hover:bg-green-500 hover:text-white transition duration-200 ${className}`}
    >
      {title || children}
    </button>
  );
};

export default Button;
