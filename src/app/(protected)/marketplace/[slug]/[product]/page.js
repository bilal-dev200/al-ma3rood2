import ProductDetailsClient from "./ProductDetailsClient";
import { fetchProduct } from "@/lib/api/listings.server";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { product: productSlug } = await params;
  const productData = await fetchProduct(productSlug);
  return {
    title: `${productData?.listing?.title || "Product"} | Ma3rood`,
    description: productData?.subtitle?.replace(/<[^>]+>/g, "")?.slice(0, 160) || "View product details.",
    // openGraph: {
    //   title: `${productData?.title || "Product"} | Ma3rood`,
    //   description: productData?.subtitle?.replace(/<[^>]+>/g, "")?.slice(0, 160) || "View product details.",
    //   url: `https://yourdomain.com/marketplace/${productData?.category?.slug}/${productData?.slug}`,
    //   siteName: "Ma3rood",
    //   images: [
    //     {
    //       url: productData?.images?.[0]?.image_path
    //         ? `https://yourdomain.com/${productData.images[0].image_path}`
    //         : "https://yourdomain.com/default-product.jpg",
    //       width: 1200,
    //       height: 630,
    //       alt: productData?.title || "Product",
    //     },
    //   ],
    //   locale: "en_US",
    //   type: "product",
    // },
    robots: "index, follow",
  };
}

export default async function ProductDetailsPage({ params }) {
  const { product: productSlug } = await params;
  const product = await fetchProduct(productSlug);
  console.log(product, "products")

  if (!product?.listing) {
    return <div className="p-10 text-gray-500">Product not found.</div>;
  }

  // Client state for image selection and modal
  // This will be handled in a client subcomponent

  return (
    <Suspense fallback={<div className="p-10 text-gray-500">Loading Listing Details</div>}>
      <ProductDetailsClient product={product?.listing} feedbackPercentage={product?.creator_feedback_percentage} />
    </Suspense>
  );
}