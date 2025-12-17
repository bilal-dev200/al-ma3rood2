import React from "react";
import Link from "next/link";
import JobOverview from "@/components/WebsiteComponents/JobDetailPageComponent/JobOverview";
import JobDescriptionAndSidebar from "@/components/WebsiteComponents/JobDetailPageComponent/JobDescriptionAndSidebar";
import { fetchProduct } from "@/lib/api/job-listing.server";
import { notFound } from "next/navigation";
import { Image_URL } from "@/config/constants";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

// ✅ Dynamic Metadata (for SEO)
export async function generateMetadata({ params }) {
  const { jobDetails } = await  params;

  try {
    const product = await fetchProduct(jobDetails);
console.log("Metadata Product:", product);
    return {
      title: `${product?.data.title || "Job Detail"} | Saudi Jobs`,
      description: product?.data.title || "View job details and apply now.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Job Not Found | Saudi Jobs",
      description: "This job listing could not be found.",
    };
  }
}

// ✅ Main Page Component
export default async function Page({ params }) {
  const { jobDetails } = await  params;

  let product;
  try {
    product = await fetchProduct(jobDetails);
  } catch (error) {
    console.error("Error fetching job:", error);
    return notFound();
  }

  console.log("Job Detail Product:", product);

  if (!product) {
    return notFound();
  }

   const items = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: product?.data.title || "Product" },
  ];

  return (
    <div className="bg-white min-h-screen relative">
       {/* ✅ Banner Section */}
       {product?.data.banner && (
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={`${Image_URL}${product?.data.banner || "/default-job-banner.jpg"}`}
          alt={product?.data.title || "Job Banner"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2">
            {product?.data.title}
          </h1>
          {product?.data.company_name && (
            <p className="text-sm md:text-lg text-gray-200">
              {product?.data.company_name}
            </p>
          )}
        </div>
      </div>
       )}
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={items}
        styles={{
          nav: "flex justify-start text-sm font-medium bg-white border-b border-gray-200 px-10 py-3",
        }}
      />

      {/* Page Content */}
      <div className="mt-8">
        <JobOverview product={product?.data} />
      </div>

      <div className="mt-10">
        <JobDescriptionAndSidebar product={product?.data} />
      </div>
    </div>
  );
}
