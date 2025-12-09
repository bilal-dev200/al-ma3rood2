import { cookies } from "next/headers";

export async function fetchCategory(categoryId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}category/?status=1&parent_id=${categoryId}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  const data = await res.json();
  return data;
}

export async function fetchAllCategories() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}category?status=1&category_type=marketplace&limit=30`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories: ' + res.status);
    const data = await res.json();
    return { categories: data, isLoading: false, error: null };
  } catch (error) {
    return { categories: [], isLoading: false, error: error.message };
  }
} 

export async function fetchAllJobCategories() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_MA3ROOD}category?status=1&category_type=job&limit=30`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories: ' + res.status);
    const data = await res.json();
    return { categories: data, isLoading: false, error: null };
  } catch (error) {
    return { categories: [], isLoading: false, error: error.message };
  }
} 