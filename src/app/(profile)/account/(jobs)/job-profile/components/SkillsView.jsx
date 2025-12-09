"use client";
import React from "react";
import { FaEdit } from "react-icons/fa";

const SkillsView = ({ data = [], onEdit }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <FaEdit /> Edit
        </button>
      </div>

      {data.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <li
              key={skill.id || skill.name}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {skill.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No skills added yet.</p>
      )}
    </div>
  );
};

export default SkillsView;
