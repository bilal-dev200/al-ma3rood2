"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import ListingForm from "@/components/WebsiteComponents/listingforms/ListingForm";
import { toast } from "react-toastify";
import MotorListingForm from "@/components/WebsiteComponents/listingforms/MotorListingForm";
import Properties from "@/components/WebsiteComponents/listingforms/Properties";
import { useAuthStore } from "@/lib/stores/authStore";
import JobListingForm from "@/components/WebsiteComponents/listingforms/JobListingForm";
import { JobsApi } from "@/lib/api/job-listing";


const EditListingPage = ({ params: paramsPromise }) => {
  const { user } = useAuthStore();
  const params = use(paramsPromise);
  const { slug } = params;
  const [listing, setListing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/"); 
    }
  }, [router]);

  useEffect(() => {
    if (slug) {
      JobsApi.getListingBySlug(slug).then((res) => {
        setListing(res);
      });
    }
  }, [slug]);

    // ✅ Protect: Only creator can edit
  useEffect(() => {
    console.log("listing", listing);
    if (listing && user) {
      if (user?.id !== listing?.user?.id) {
        toast.error("You are not authorized to edit this listing.");
        router.replace("/");
      }
    }
  }, [listing, user]);

  if (!listing) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      const updatedListing = await JobsApi.updateJob(slug, data);
      if (updatedListing && updatedListing.slug) {
        toast.success("Job updated successfully!");
        router.push(`/listing/viewJob?slug=${updatedListing.slug}`);
      }
    } catch (err) {
      toast.error("Failed to update listing.");
    }
  };

  return (
      <div className="p-6">
      {/* {listing?.listing_type === "marketplace" ? (
        <ListingForm
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      ) :  listing?.listing_type === "motors" ?  (
        <MotorListingForm
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      ) : 
       (
        <Properties
          initialValues={listing}
          mode="edit"
          onSubmit={handleUpdate}
        />
      )} */}
      <JobListingForm
        initialValues={listing}
        mode="edit"
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default EditListingPage; 