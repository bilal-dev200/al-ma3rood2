import { notFound } from "next/navigation";
import Image from "next/image";
import ServiceDetailsPage from "./ServiceDetailsPage";
import { servicesApi } from "@/lib/api/services";
import { Image_URL } from "@/config/constants";

function mapServiceResponse(raw) {
  if (!raw) return null;
  const region = raw.region || {};
  const governorate = raw.governorate || {};
  const category = raw.category || {};
  const imagePath = raw.images?.[0]?.image_path;
  const photoUrl =
    raw.photo?.url ||
    (imagePath && Image_URL ? `${Image_URL}${imagePath}` : "/placeholder.svg");

  const gallery =
    raw.images?.map((img) => ({
      url: Image_URL ? `${Image_URL}${img.image_path}` : "/placeholder.svg",
      width: 960,
      height: 640,
      alt: raw.title,
    })) || [];

  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description,
    category: category.name,
    subcategory: category.name,
    category_id: raw.category_id,
    region: region.id ? String(region.id) : "",
    regionLabel: region.name || "",
    area: governorate.name || "",
    price: Number.parseFloat(raw.price) || 0,
    priceUnit: raw.price_unit || "per project",
    rating:
      raw.rating ??
      raw.average_rating ??
      (raw.total_reviews ? 5 : null),
    reviews: raw.reviews ?? raw.total_reviews ?? 0,
    responseTime: raw.response_time || "",
    nextAvailability: raw.next_availability || "",
    isVerified: raw.is_verified ?? false,
    badges: raw.badges || [],
    experience: raw.experience || "",
    tags: raw.tags || [],
    photo: {
      url: photoUrl,
      alt: raw.title,
      width: 960,
      height: 640,
    },
    gallery,
    user: raw.user,
    schedule: raw.schedule || [],
  };
}

async function fetchRelatedServices(service) {
  try {
    const response = await servicesApi.getServices({
      subcategory: service.category_id,
      region: service.region,
      pageSize: 4,
    });
    const data = Array.isArray(response?.data) ? response.data : [];
    return data
      .filter((item) => item.slug !== service.slug)
      .map(mapServiceResponse)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await servicesApi.getServiceBySlug(slug);
    const service = mapServiceResponse(response?.data?.service);
    if (!service) {
      return {
        title: "Service not found | Ma3rood Services",
      };
    }
    return {
      title: `${service.title} | Ma3rood Services`,
      description: service.subtitle || service.description,
    };
  } catch {
    return {
      title: "Service not found | Ma3rood Services",
    };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const response = await servicesApi.getServiceBySlug(slug);
  const mappedService = mapServiceResponse(response?.data?.service);

  if (!mappedService) {
    notFound();
  }

  const relatedServices = await fetchRelatedServices(response.data.service);

  return (
    <main className="bg-white min-h-screen">
      <ServiceDetailsPage
        service={mappedService}
        relatedServices={relatedServices}
      />
    </main>
  );
}
