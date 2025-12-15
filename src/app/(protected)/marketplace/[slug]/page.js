import Link from "next/link";
import { fetchAllCategories, fetchCategory } from "@/lib/api/category.server";
import { fetchAllListingsByFilter } from "@/lib/api/listings.server";
import React from "react";
import CategoryClient from "./CategoryClient";
import Breadcrumbs from "@/components/WebsiteComponents/ReuseableComponenets/Breadcrumbs";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { categoryId } = await searchParams;
  const allCategories = await fetchAllCategories();
  const currentCategory = allCategories?.categories?.data?.find((cat) => cat.id == categoryId);
  return {
    title: `${currentCategory?.name || slug} | Ma3rood`,
    // description: slug?.subtitle?.replace(/<[^>]+>/g, "")?.slice(0, 160) || "View product details.",
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

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const { categoryId, search, city, page = 1, region_id, governorate_id, min_price, max_price, condition, sort_by } = await searchParams;
  const category = await fetchCategory(categoryId);
  const allCategories = await fetchAllCategories();
  const currentCategory = allCategories?.categories?.data?.find((cat) => cat.id == categoryId);
  const products = await fetchAllListingsByFilter({
    listing_type: "marketplace",
    category_id: categoryId,
    search, city, page: 1, region_id, governorate_id,
    min_price, max_price, condition, sort_by
  });

  // Extract pagination info from API response
  const pagination = {
    currentPage: products?.pagination?.current_page || 1,
    totalPages: products?.pagination?.last_page || 5,
    perPage: products?.pagination?.per_page || 10,
    totalItems: products?.pagination?.total || 1000,
  };

  // Function to flatten the category tree into an array
  const getCategoryBreadcrumbs = (category) => {
    const breadcrumbs = [];
    let current = category;

    while (current) {
      const lastSlugPart = current.slug.split("/").pop();
      breadcrumbs.unshift({
        label: current.name,
        href: `/marketplace/${lastSlugPart}?categoryId=${current.id}`,
      });
      current = current.parent_recursive;
    }

    return breadcrumbs;
  };

  // Static breadcrumbs
  const staticItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
  ];

  // Combine static and dynamic breadcrumbs
  const items = [...staticItems, ...getCategoryBreadcrumbs(products?.category_tree)];

  return (
    <>
      <Breadcrumbs
        items={items}
        styles={{ nav: "flex justify-start flex-wrap text-sm font-medium bg-white border-b border-gray-200 px-6 md:px-10 py-3" }}
      />
      <div className="mx-auto px-3 mt-5">
        <React.Suspense
          fallback={
            <div className="p-6 text-gray-500">
              Loading {category?.name || "Category"}...
            </div>
          }
        >
          <CategoryClient
            slug={slug}
            category={category}
            initialProducts={products?.data || []}
            categoryId={categoryId}
            pagination={pagination}
            search={search}
          />
        </React.Suspense>
      </div>
    </>
  );
}
