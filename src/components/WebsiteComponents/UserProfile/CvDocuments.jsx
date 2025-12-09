import React from "react";
import Button from "../ReuseableComponenets/Button";

const CvDocuments = () => {
  return (
    <div className="mx-auto -mt-5 ml-5 ">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6">CVs and documents</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button title="Cvs" />
        <Button title="Cover letters" />
        <Button title="Documnets" />
      </div>

      {/* Add New CV Button */}
      <div className="flex items-center space-x-3 mb-6">
        <button className="bg-white border border-gray-300 px-4 py-1 rounded-[9px] text-sm">
          add a new CV
        </button>
        <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-[6px]">
          Max file size is 5 MB
        </span>
      </div>

      {/* Info Box */}
      <div className="bg-gray-100 rounded-md p-4 text-sm text-gray-700">
        <p>You do not currently have any saved documents.</p>
        <p>
          You can save documents such as CVs or cover letters for later use when
          you apply for a job using Ma3rood
        </p>

        <button className="mt-4 bg-green-500 text-white text-xs px-3 py-1 rounded-[6px]">
          my Ma3rood
        </button>

        <p className="mt-3">
          Get tips from Careers New Zealand on{" "}
          <a href="#" className="text-[#469BDB]">
            writing a winning CV and cover latter
          </a>
        </p>
      </div>
    </div>
  );
};

export default CvDocuments;
