"use client";
import { Image_URL } from "@/config/constants";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const CvView = ({ data = [], onAdd, onDelete }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-600">Uploaded CVs</h2>

        {/* Hide Add Button if 3 CVs already exist */}
        {data.length < 3 && (
          <button
            onClick={onAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add New CV
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500">No CVs uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((cv, index) => (
            <div
              key={cv.id}
              className="flex justify-between items-center border border-gray-200 p-4 rounded-md transition"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {cv?.name}
                </p>
                <a
                  href={`${Image_URL}${cv.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm underline"
                >
                  View / Download
                </a>
              </div>

              <button
                onClick={() => onDelete(cv.id)}
                className="text-red-600 hover:text-red-800"
              >
                <AiOutlineDelete size={22} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CvView;
