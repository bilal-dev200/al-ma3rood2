import { cookies } from "next/headers";

export async function fetchProduct(productSlug) {
  if (!productSlug) {
    throw new Error("Product slug is required");
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log(
      "URL",
      `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/${productSlug}/show`
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/${productSlug}/show`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(`Failed to fetch product: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("fetchProduct error:", error);
    throw error;
  }
}

// export async function fetchProduct(productSlug) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('auth-token')?.value;
//   console.log('token', token);

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/${productSlug}/show`, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//     },
//     cache: 'no-store',
//   });
//   console.log("res", res);

//   if (!res.ok) throw new Error('Failed to fetch product');
//   const data = await res.json();
//   return data.data;
// }

// export async function fetchProductsForCategory(categoryId, page = 1) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value;
//   let url = categoryId
//     ? `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?category_id=${categoryId}&status=1&page=${page}`
//     : `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?page=${page}`;
//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error('Failed to fetch products');
//   const data = await res.json();
//   return data;
// }
export async function fetchProductsForCategory(
  categoryId,
  search = "",
  city = "",
  page = 1
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?status=1&page=${page}`;

  if (categoryId) {
    url += `&category_id=${categoryId}`;
  }

  if (search !== "") {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (city !== "") {
    url += `&city=${encodeURIComponent(city)}`;
  }

  console.log(url);
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data;
}

// export async function fetchAllListings(categoryId, categoryIdFilter, search) {
//   try {
//     const url = categoryId
//       ? `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?category_id=${categoryId}&status=1`
//       : `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?status=1`;
//     const res = await fetch(url, {
//       headers: { 'Content-Type': 'application/json' },
//       cache: 'no-store',
//     });
//     if (!res.ok) throw new Error('Failed to fetch listings: ' + res.status);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     return [];
//   }
// }
export async function fetchAllListings(
  categoryId,
  categoryIdFilter,
  search,
  city
) {
  try {
    const params = new URLSearchParams();

    // Apply category from URL param or filter param
    const category = categoryIdFilter || categoryId;
    if (category) params.set("category_id", category);

    params.set("status", "1");

    if (search) params.set("search", search);

    if (city) params.set("city", city);

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD
      }listings?${params.toString()}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch listings: " + res.status);
    return await res.json();
  } catch (error) {
    console.error("fetchAllListings error:", error);
    return { data: { data: [] } }; // Return fallback structure
  }
}

export async function fetchAllListingsByFilter(payload) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/filters`;

    const formattedPayload = {
      listing_type: payload?.listing_type || "marketplace",
      pagination: {
        page: payload?.pagination?.page || 1,
        per_page: payload?.pagination?.per_page || 16,
      },
    };

    // ✅ add category_id conditionally
    if (payload?.category_id !== undefined && payload?.category_id !== null) {
      const categoryId = parseInt(payload.category_id, 10);
      if (!Number.isNaN(categoryId)) {
        formattedPayload.category_id = categoryId;
      }
    }
    // ✅ add city if present
    if (payload?.city) {
      formattedPayload.city = payload.city;
    }
    if (payload?.region_id) {
      formattedPayload.regions_id = payload.region_id;
    }
    if (payload?.governorate_id) {
      formattedPayload.governorates_id = payload.governorate_id;
    }
    if (payload?.creator_id) {
      formattedPayload.creator_id = payload.creator_id;
    }

    // ✅ add condition if present
    if (payload?.condition) {
      formattedPayload.condition = payload.condition;
    }

    // ✅ add search if present
    if (payload?.search) {
      formattedPayload.search = payload.search;
    }

    // ✅ add min_price if present
    if (payload?.min_price !== undefined && payload?.min_price !== null) {
      formattedPayload.min_price = payload.min_price;
    }

    // ✅ add max_price if present
    if (payload?.max_price !== undefined && payload?.max_price !== null) {
      formattedPayload.max_price = payload.max_price;
    }

    if (payload?.status) {
      formattedPayload.status = payload.status;
    }

    // ✅ add filters if present
    if (payload?.filters && Object.keys(payload.filters).length > 0) {
      formattedPayload.filters = { ...payload.filters };
    }

    console.log("formattedPayload", JSON.stringify(formattedPayload));

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(formattedPayload),
    });

    if (!res.ok) throw new Error("Failed to fetch listings: " + res.status);

    return await res.json();
  } catch (error) {
    console.error("fetchAllListings error:", error);
    return { data: { data: [] } }; // Return fallback structure
  }
}

export async function fetchAllMotorsApi(payload) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/filters`;

    const formattedPayload = {
      listing_type: "motors",
      pagination: {
        page: payload?.pagination?.page || 1,
        per_page: payload?.pagination?.per_page || 10,
      },
    };

    // ✅ add category_id conditionally
    if (payload?.category_id !== undefined && payload?.category_id !== null) {
      const categoryId = parseInt(payload.category_id, 10);
      if (!Number.isNaN(categoryId)) {
        formattedPayload.category_id = categoryId;
      }
    }
    // ✅ add city if present
    if (payload?.city) {
      formattedPayload.city = payload.city;
    }

    // ✅ add condition if present
    if (payload?.condition) {
      formattedPayload.condition = payload.condition;
    }

    // ✅ add search if present
    if (payload?.search) {
      formattedPayload.search = payload.search;
    }

    // ✅ add min_price if present
    if (payload?.min_price !== undefined && payload?.min_price !== null) {
      formattedPayload.min_price = payload.min_price;
    }

    // ✅ add max_price if present
    if (payload?.max_price !== undefined && payload?.max_price !== null) {
      formattedPayload.max_price = payload.max_price;
    }

    // ✅ add filters if present
    if (payload?.filters && Object.keys(payload.filters).length > 0) {
      formattedPayload.filters = { ...payload.filters };
    }
    console.log("formattedPayload", formattedPayload);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(formattedPayload),
    });

    if (!res.ok) throw new Error("Failed to fetch listings: " + res.status);

    console.log(res.data);

    return await res.json();
  } catch (error) {
    console.error("fetchAllListings error:", error);
    return { data: { data: [] } }; // Return fallback structure
  }
}

export async function fetchListingsByReservePrice(reservePrice) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings?reserve_price=${reservePrice}&status=1`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch listings: " + res.status);
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function fetchCoolAuctions() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}listings/coolAuctions`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok)
      throw new Error("Failed to fetch cool auctions: " + res.status);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("fetchCoolAuctions error:", error);
    return { data: [] }; // Return fallback structure
  }
}
