"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import ListingForm from "@/components/WebsiteComponents/listingforms/ListingForm";
import { toast } from "react-toastify";
import MotorListingForm from "@/components/WebsiteComponents/listingforms/MotorListingForm";
import Properties from "@/components/WebsiteComponents/listingforms/Properties";
import { useAuthStore } from "@/lib/stores/authStore";


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
      listingsApi.getListingBySlug(slug).then((res) => {
        setListing(res.listing);
      });
    }
  }, [slug]);

    // ✅ Protect: Only creator can edit
  useEffect(() => {
    console.log("listing", listing);
    if (listing && user) {
      if (user.id !== listing.creator.id) {
        toast.error("You are not authorized to edit this listing.");
        router.replace("/");
      }
    }
  }, [listing, user]);

  if (!listing) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      const updatedListing = await listingsApi.updateListing(slug, data);
      if (updatedListing && updatedListing.slug) {
        toast.success("Listing updated successfully!");
        router.push(`/listing/viewlisting?slug=${updatedListing.slug}`);
      }
 } catch (err) {
  console.log("Update listing error:", err?.response);

  // ✅ Handle validation error (422)
  if (err?.status === 422) {
    const data = err?.data?.data; // 👈 IMPORTANT

    if (data && typeof data === "object") {
      // get first field error
      const firstError = Object.values(data)?.[0]?.[0];

      if (firstError) {
        toast.error(firstError);
        return; // ⛔ stop here (NO generic error)
      }
    }

    // fallback (still validation, no generic error)
    toast.error(err.response.data?.message || "Validation failed");
    return;
  }

  // ❌ only for NON-422 errors
  toast.error("Something went wrong. Please try again.");
}

  };

  return (
      <div className="p-6">
      {listing?.listing_type === "marketplace" ? (
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
      )}
    </div>
  );
};

export default EditListingPage; 