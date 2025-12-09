import React from "react";

const InputField = ({ label, value, onChange, options = [], type = "select" }) => {
  return (
    <div className="text-sm">
      <label className="block mb-1 font-medium text-gray-800">{label}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className="md:w-[400px] w-[300px]  border border-green-400 rounded-md p-1.5"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="md:w-[400px] w-[300px] border border-green-400 rounded-md p-1.5"
        />
      )}
    </div>
  );
};

export default InputField;
