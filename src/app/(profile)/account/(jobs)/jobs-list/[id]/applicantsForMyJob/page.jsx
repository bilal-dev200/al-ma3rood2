"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JobsApi } from "@/lib/api/job-listing";
import { Image_URL } from "@/config/constants";
import { Mail, Phone, FileText, MessageSquare, User } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function ApplicantsForMyJob() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All applicants");

  useEffect(() => {
    if (id) fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      const response = await JobsApi.getUserJobApplicants({ id });
      setApplicants(response?.data || []);
      console.log("✅ Applicants fetched:", response);
    } catch (error) {
      console.error("❌ Failed to fetch applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (job_application_id, job_status) => {
    try {
      const response = await JobsApi.updateJobApplicationStatus({
        job_application_id,
        job_status,
      });

      // ✅ Update UI instantly
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === job_application_id ? { ...app, job_status } : app
        )
      );

      // ✅ Success toast
      toast.success(response?.message || `Status updated to ${job_status}`);

      console.log(`✅ Status updated to ${job_status}`);
    } catch (error) {
      // ❌ Error toast
      toast.error(
        error?.data?.message || "Failed to update job status. Please try again."
      );

      console.error("❌ Failed to update status:", error);
    }
  };

  // ✅ Filter applicants based on active tab
  const filteredApplicants = applicants.filter((applicant) => {
    if (activeTab === "All applicants") return true;
    if (activeTab === "Not suitable")
      return applicant.job_status === "notSuitable";
    if (activeTab === "Shortlist") return applicant.job_status === "shortList";
    return true;
  });

  const tabs = ["All applicants", "Not suitable", "Shortlist"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Job Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {applicants?.[0]?.job_title}
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-2 text-sm font-medium ${
              activeTab === tab
                ? "text-[#12513E] border-b-2 border-[#12513E]"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applicant List */}
      {loading ? (
        <p className="text-gray-500">Loading applicants...</p>
      ) : filteredApplicants.length === 0 ? (
        <p className="text-gray-500">No applicants found.</p>
      ) : (
        <div className="space-y-5">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:justify-between md:items-center"
            >
              {/* Left: Applicant Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {applicant.full_name}
                </h2>
                <div className="flex flex-col mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} /> {applicant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} /> {applicant.phone}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied: {new Date(applicant.created_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Current status:{" "}
                    <span className="font-medium text-gray-800 uppercase">
                      {applicant.job_status || "Pending"}
                    </span>
                  </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-3 text-blue-600 text-sm">
                  {applicant.cv?.file_path && (
                    <a
                      href={`${Image_URL}${applicant.cv.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <FileText size={16} /> View CV
                    </a>
                  )}
                  {applicant.cl?.file_path && (
                    <a
                      href={`${Image_URL}${applicant.cl.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <MessageSquare size={16} /> View Cover Letter
                    </a>
                  )}
                  <Link
                    href={`/profile/${applicant.id}`}
                    className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline"
                  >
                    <User size={16} /> Show Profile
                  </Link>
                </div>
              </div>

              {/* Right: Actions */}
              {applicant.job_status?.toLowerCase() !== "hired" && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  {applicant.job_status === "shortList" ? (
                    <button
                      onClick={() => handleStatusUpdate(applicant.id, "hired")}
                      className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition"
                    >
                      Hire
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(applicant.id, "shortList")
                        }
                        className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition"
                      >
                        Add to shortlist
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(applicant.id, "notSuitable")
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                      >
                        Not suitable
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}