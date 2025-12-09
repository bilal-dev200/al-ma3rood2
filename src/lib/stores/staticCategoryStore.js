import { create } from "zustand";

const staticCategories = [
  {
    title: "Marketplace",
    type: "marketplace", // 👈 add type field
    image: "/latest3.png",
    colSpan: "md:col-span-4",
    rowSpan: "md:row-span-2",
    height: "h-[400px] md:h-full",
    route: "/marketplace",
    rounded: "rounded-xl",
  },
  {
    title: "Motors",
    type: "motors",
    image: "/motors.jpg",
    colSpan: "md:col-span-5",
    rowSpan: "md:row-span-1",
    height: "h-[250px] md:h-full",
    route: "/motors",
    rounded: "rounded-xl",
  },
  {
    title: "Services",
    type: "services",
    image: "/services.jpeg",
    colSpan: "md:col-span-3",
    rowSpan: "md:row-span-1",
    height: "h-[250px] md:h-full",
    route: "/services",
    rounded: "rounded-xl",
  },
  {
    title: "Jobs",
    type: "jobs",
    image: "/jobs.png",
    colSpan: "md:col-span-3",
    rowSpan: "md:row-span-1",
    height: "h-[200px]",
     route: "/jobs",
    rounded: "rounded-3xl",
  },
  {
    title: "Property",
    type: "property",
    image: "/property.png",
    colSpan: "md:col-span-5",
    rowSpan: "md:row-span-1",
    height: "h-[250px] md:h-full",
        route: "/property",
    rounded: "rounded-xl",
  },
];

export const useStaticCategoryStore = create((set) => ({
  staticCategories: staticCategories,
  selectedStaticCategory: null,
  setSelectedStaticCategory: (category) => set({ selectedCategory: category }),
  getAllStaticCategories: () => staticCategories,
}));
