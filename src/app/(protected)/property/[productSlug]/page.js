import React from "react";
import { fetchProduct, fetchAllMotorsApi } from "@/lib/api/listings.server";
import ProductDetailsClient from "@/components/WebsiteComponents/CarDetailComponents/ProductDetailsClient";

const page = async ({ params }) => {
  const { productSlug } = await params;
  const product = await fetchProduct(productSlug);
  const motors = await fetchAllMotorsApi();


  console.log("motors", motors);


  const items = [
    { label: "Home", href: "/" },
    { label: "Property", href: "/property" },
    { label: product.title || "Property" },
  ];

  return (
    <div className="bg-white min-h-screen relative">
      {/* {product?.listing?.vehicle_type !== "Car parts & accessories" ? (
        <CarListing product={product.listing} dealer_listing={product.dealers_other_listings} motors={motors?.data}/>
      ) : ( */}
      <ProductDetailsClient product={product?.listing} initialnearBy={product?.nearby_listings} feedbackPercentage={product?.creator_feedback_percentage} />
      {/* )} */}
    </div>
  );
};

export default page;
