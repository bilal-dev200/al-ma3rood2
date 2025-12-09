"use client";

import { useState, useEffect } from "react";
import { X, FileText, Upload, FileBadge } from "lucide-react";
import { toast } from "react-toastify";
import { getApi, profilePostApi } from "@/lib/api/jobs-profile";

const JobApplicationModal = ({ isOpen, onClose, jobId }) => {
  const [loading, setLoading] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [cvChoice, setCvChoice] = useState("existing");
  const [newCvFile, setNewCvFile] = useState(null);
  const [errors, setErrors] = useState({}); // ✅ Error state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cv_id: "",
  });

  // ✅ Fetch CVs
  useEffect(() => {
    if (!isOpen) return;
    const fetchJobProfile = async () => {
      try {
        const res = await getApi("user/job/profile");
        setCvs(res?.cvs || []);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };
    fetchJobProfile();
  }, [isOpen]);

  // ✅ File validation
  const validateFile = (file) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return file && allowed.includes(file.type);
  };

  const handleChange = (e) => {
    setErrors({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    setErrors({});
    const file = e.target.files[0];
    if (validateFile(file)) setCoverFile(file);
    else {
      toast.error("Please upload PDF, DOC, or DOCX only.");
      e.target.value = "";
    }
  };

  const validateCvFile = (file) => {
  return file && file.type === "application/pdf";
};

  const handleNewCvUpload = (e) => {
    setErrors({});
    const file = e.target.files[0];
    if (validateCvFile(file)) setNewCvFile(file);
    else {
      toast.error("Please upload PDF only.");
      e.target.value = "";
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!coverFile) return toast.error("Please upload a cover letter file.");
    if (cvChoice === "existing" && !formData.cv_id)
      return toast.error("Please select a CV.");
    if (cvChoice === "new" && !newCvFile)
      return toast.error("Please upload a CV file.");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("job_listing_id", jobId);
      data.append("full_name", formData.full_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("cover_letters", coverFile);

      if (cvChoice === "new") data.append("cv", newCvFile);
      else data.append("cv_id", formData.cv_id);

      const res= await profilePostApi("user/job-applying/store", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.message || "Application submitted successfully!");
      setFormData({ full_name: "", email: "", phone: "", cv_id: "" });
      setCoverFile(null);
      setNewCvFile(null);
      setCvChoice("existing");
      onClose();
    } catch (error) {
      console.error("Application Error:", error);
        const msg = error.data.message || "Something went wrong.";
        setErrors(msg);
        // console.log("Validation Errors:", msg);
        // // Show top-level error in toast too
        // toast.error("Please fix the highlighted fields.");
         // ✅ Extract error message safely
  // const msg = error?.response?.data?.message || error?.message || "Something went wrong.";

  // ✅ If it's an object of validation errors
  if (typeof msg === "object") {
    setErrors(msg);
    toast.error("Please fix the highlighted fields.");
  } else {
    // ✅ If it's a single error message from backend
    setErrors({ general: msg });
    toast.error(msg);
  }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5 text-[#175f48]" />
            Apply for this Job
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#175f48]"
              />
              {errors?.full_name && (
                <p className="text-red-500 text-xs mt-1">{errors.full_name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#175f48]"
              />
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#175f48]"
              />
              {errors?.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone[0]}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Upload className="w-4 h-4" /> Cover Letter
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCoverChange}
                required
                className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 cursor-pointer focus:ring-1 focus:ring-[#175f48]"
              />
              {coverFile && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  📄 {coverFile.name}
                </p>
              )}
              {errors?.cover_letters && (
                <p className="text-red-500 text-xs mt-1">{errors.cover_letters[0]}</p>
              )}
            </div>
          </div>

          {/* CV Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FileBadge className="w-4 h-4" /> CV Option
            </label>

            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="cvChoice"
                  value="existing"
                  checked={cvChoice === "existing"}
                  onChange={() => setCvChoice("existing")}
                />
                Use Existing CV
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="cvChoice"
                  value="new"
                  checked={cvChoice === "new"}
                  onChange={() => setCvChoice("new")}
                />
                Upload New CV (PDF Only)
              </label>
            </div>

            {cvChoice === "existing" ? (
              <div>
                <select
                  name="cv_id"
                  value={formData.cv_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-1 focus:ring-[#175f48]"
                >
                  <option value="">Select your CV</option>
                  {cvs.length > 0 ? (
                    cvs.map((cv, i) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.name || `CV #${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option disabled>No CVs found</option>
                  )}
                </select>
                {errors?.cv_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.cv_id[0]}</p>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleNewCvUpload}
                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 cursor-pointer focus:ring-1 focus:ring-[#175f48]"
                />
                {newCvFile && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    📄 {newCvFile.name}
                  </p>
                )}
                {errors?.cv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cv[0]}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-3 rounded-lg text-white font-medium transition-all duration-150 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#175f48] hover:bg-[#147c59]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;
