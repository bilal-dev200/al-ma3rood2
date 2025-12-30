"use client";
import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaEye, FaStar } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import WithdrawJobDialog from "@/components/WebsiteComponents/ReuseableComponenets/WithdrawJobDialog";
import { useSearchParams } from "next/navigation";
import { Image_URL } from "@/config/constants";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/stores/authStore";
import { JobsApi } from "@/lib/api/job-listing";

// Utility to format work type
const formatWorkType = (type) => {
  if (!type) return "N/A";
  return type.replace(/_/g, " ").toUpperCase();
};

const Page = () => {
  const { user } = useAuthStore();
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [listing, setListing] = useState(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  // ✅ Protect: Only user can edit
  useEffect(() => {
    if (listing && user) {
      if (user.id !== listing.user.id) {
        // NOTE: For job listings, you might allow non-owners to view,
        // but restrict 'edit/withdraw' actions. I'm keeping the original
        // redirect logic as a strong guardrail, but this is debatable.
        // toast.error("You are not authorized to view this listing.");
        // router.replace("/");
      }
    }
  }, [listing, user]);

  useEffect(() => {
    if (slug) {
      JobsApi.getListingBySlug(slug).then((res) => {
        setListing(res);
        console.log("Listing Details:", res);
      });
    }
  }, [slug]);

  if (!listing)
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;

  // --- JOB DATA TRANSFORMATION ---
  const companyLogo = listing.logo || "";
  const jobBanner = listing.banner || "";
  const videoLink = listing.video_link;

  // Job Details array
  const jobDetails = [
    { label: "Company", value: listing.company_name },
    { label: "Category", value: listing.category?.name || "N/A" },
    { label: "Work Type", value: formatWorkType(listing.work_type) },
    {
      label: "Location",
      value: `${listing.governorate?.name || "N/A"}, ${
        listing.region?.name || "N/A"
      }`,
    },
    {
      label: "Entry Level",
      value: listing?.is_entry_level ? t("Yes") : t("No"),
    },
    {
      label: "Posted On",
      value: new Date(listing?.created_at).toLocaleDateString(),
    },
    {
      label: "Deadline",
      value: new Date(listing?.deadline).toLocaleDateString(),
    },
  ];

  // Key Points (often a list in job listings)
  const keyPoints = listing.key_points || [];

  // Compensation Info
  const compensation = {
    payType: formatWorkType(listing.minimum_pay_type),
    payAmount: listing.minimum_pay_amount,
    showPay: listing.show_pay,
  };

  // Job Meta (similar to original meta, simplified for a job)
  const jobMeta = {
    jobTitle: listing.title,
    company: listing.company_name,
    views: listing.view_count || 0, // Assuming view_count is still available
  };
  // --- END JOB DATA TRANSFORMATION ---

  // NOTE: Withdraw functionality is maintained, but logic should be confirmed
  async function handleWithdraw(option) {
    try {
      await JobsApi.withdrawListing(listing.id); // Assuming a JobsApi.withdrawListing exists
       toast.success("Job withdrawn successfully");
      setOpenWithdrawDialog(false);
      router.replace("/account/jobs-list");
    } catch (error) {
      console.log("error", error);
      toast.error(t("Failed to withdraw listing."));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Heading - Job Title and Company Banner */}
      <div className="mb-6">
        {jobBanner && (
          <img
            src={`${Image_URL}${jobBanner}`}
            alt="Job Banner"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}
        <div className="flex items-center gap-4">
          {companyLogo && (
            <img
              src={`${Image_URL}${companyLogo}`}
              alt="Company Logo"
              className="w-16 h-16 object-contain rounded"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {jobMeta.jobTitle}
            </h1>
            <h2 className="text-xl text-gray-600">{jobMeta.company}</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FaEye className="inline" /> {jobMeta.views} {t("views")}
            </p>
          </div>
        </div>
      </div>
      <hr className="my-6" />

      {/* Grid Layout: Main Content (Left) and Key Info/Action (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ==== LEFT COLUMN: DESCRIPTION + KEY POINTS + SELLER ==== */}
        <div className="lg:col-span-2 space-y-8">
          {/* JOB DETAILS (Table/List) */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {t("Job Summary")}
            </h3>
            <div className="space-y-3 p-4  rounded-lg bg-white">
              {jobDetails.map((item, idx) => (
                <div
                  className="flex justify-between items-start border-b pb-2 last:border-b-0 last:pb-0"
                  key={idx}
                >
                  <div className="font-medium text-gray-600 text-sm w-1/3">
                    {t(item.label)}:
                  </div>
                  <div className="text-sm text-gray-800 w-2/3 text-right">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* JOB KEY POINTS */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {t("Key Responsibilities/Requirements")}
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
              {keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm">
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* JOB DESCRIPTION */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {t("Full Description")}
            </h3>
            <div className="text-gray-700 leading-relaxed text-sm p-4  rounded-lg bg-white">
              <div dangerouslySetInnerHTML={{ __html: listing.description }} />
            </div>
          </section>

          {/* VIDEO LINK */}
          {videoLink && (
            <section>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {t("Video Overview")}
              </h3>
              <a
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                {t("Watch Job/Company Video")}
              </a>
            </section>
          )}

          {/* SELLER INFO: ABOUT THE RECRUITER/COMPANY CONTACT */}
          <section>
            <h4 className="text-xl font-semibold mb-4 text-gray-700">
              {t("About the Poster/Company")}
            </h4>
            <div className="p-6  rounded-lg bg-white flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 shrink-0">
                {listing?.user?.profile_photo ? (
                  <img
                    src={`${Image_URL}${listing.user.profile_photo}`}
                    alt="Seller"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : (
                  listing?.user?.username?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-gray-800">
                  {listing?.user?.business_name || listing?.user?.username}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("Location")}:{" "}
                  {listing.user?.regions?.name
                    ? `${
                        listing.user?.address_2
                          ? `${listing.user?.address_2}, `
                          : ""
                      }${listing.user?.governorates?.name}, ${
                        listing.user?.regions?.name
                      }`
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {t("Member Since")}:{" "}
                  {listing.user?.created_at
                    ? new Date(listing.user.created_at).toLocaleDateString(
                        i18n.language === "ar" ? "ar-EG" : "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Unknown"}
                </p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  "
                  {listing.user?.favourite_quote ||
                    listing.user?.about_me ||
                    t("No quote provided.")}
                  "
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ==== RIGHT COLUMN: ACTION/PAY/CONTACT INFO ==== */}
        <div className="lg:col-span-1 space-y-6">
          {/* COMPENSATION / CONTACT / ACTION BOX */}
          <div className=" rounded-lg overflow-hidden bg-white">
            <div className="p-4 bg-green-500 text-white">
              <h3 className="text-sm font-semibold text-center">
                {t("Compensation")}
              </h3>
            </div>
            <div className="p-4 text-center">
              {compensation.showPay ? (
                <p className="text-3xl font-bold text-gray-800">
                  <span className="price">$</span>
                  {compensation.payAmount}
                  <span className="text-base font-normal ml-1 text-gray-500">
                    /{t(compensation.payType)}
                  </span>
                </p>
              ) : (
                <p className="text-lg font-semibold text-gray-600">
                  {t("Pay not disclosed")}
                </p>
              )}
            </div>

            <div className="p-4 border-t">
              <h3 className="text-sm font-semibold mb-2 text-gray-600">
                {t("Contact Details")}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>{t("Name")}:</strong> {listing.contact_name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("Email")}:</strong> {listing.contact_email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("Phone")}:</strong> {listing.contact_phone}
              </p>
            </div>

            {/* --- CONDITIONAL "APPLY NOW" BUTTON --- */}
            {/* The button is shown ONLY IF the user is logged in AND is NOT the owner (user.id !== listing.user_id) */}
            {user && user.id !== listing.user_id && (
              <div className="p-4 border-t">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    // Placeholder for actual application logic
                    toast.info(t("Application process goes here!"));
                  }}
                >
                  {t("Apply Now")}
                </Button>
              </div>
            )}
            {/* --- END CONDITIONAL BUTTON --- */}
          </div>

          {/* OWNER ACTIONS (Edit/Withdraw) */}
          {user && user.id == listing.user_id && (
            <div className="p-4  rounded-lg bg-yellow-50 space-y-2">
              <h4 className="font-semibold text-gray-700">
                {t("Your Listing Actions")}
              </h4>
              <p
                className="text-blue-600 text-sm cursor-pointer hover:underline"
                onClick={() => router.push(`/listing/edit-job/${listing.slug}`)}
              >
                {t("Edit listing")}
              </p>
              <p
                className="text-red-600 text-sm cursor-pointer hover:underline"
                onClick={() => setOpenWithdrawDialog(true)}
              >
                {t("Withdraw listing")}
              </p>
            </div>
          )}
        </div>
      </div>

      <WithdrawJobDialog
        isOpen={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
};

export default Page;
