"use client";
import React, { useState } from "react";
import { profilePostApi } from "@/lib/api/jobs-profile";
import { toast } from "react-toastify";

const SkillsForm = ({ defaultData = [], onCancel, onSuccess }) => {
  // Safely extract skill names (handles array of strings or array of objects)
  const initialSkills = defaultData.map((s) =>
    typeof s === "string" ? s : s?.name || ""
  );

  const [skills, setSkills] = useState(initialSkills.length ? initialSkills : [""]);
  const [loading, setLoading] = useState(false);

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const addSkill = () => setSkills([...skills, ""]);

  const removeSkill = (index) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      skills.forEach((skill, i) => formData.append(`skills[${i}]`, skill));

      const res= await profilePostApi("user/job-skills/store", formData);
       toast.success(res?.message || "Skills updated successfully!");
      onSuccess?.();
    } catch (err) {
      console.error("Error saving skills:", err);
      toast.error(err?.message || "Failed to save skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Edit Skills</h2>

      {skills.map((skill, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={skill}
            onChange={(e) => handleSkillChange(index, e.target.value)}
            placeholder={`Skill ${index + 1}`}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {skills.length > 1 && (
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={addSkill}
          className="text-green-600 text-sm hover:underline"
        >
          + Add Skill
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SkillsForm;
