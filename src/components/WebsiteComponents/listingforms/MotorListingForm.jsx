import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import {
  Car,
  BikeIcon as Motorbike,
  Caravan,
  Sailboat,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { motorsApi } from "@/lib/api/motors";
import { toast } from "react-toastify";
import UploadPhotos from "./UploadPhotos";
import { categoriesApi } from "@/lib/api/category";
import CategoryModal from "./CategoryModal";
import {
  getTransformedVehicleData,
  getVehicleTypeFromCategory,
  isSupportedVehicleType,
} from "@/lib/vehicles";
import SearchableDropdown from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdown";
import SearchableDropdownWithCustom from "@/components/WebsiteComponents/ReuseableComponenets/SearchableDropdownWithCustom";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/ui/QuillEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 animate-pulse rounded-md"></div>
  ),
});

const motorListingSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().nullable().optional(),
    category_id: z.number().optional().default(1),
    description: z.string().min(1, "Description is required"),
    condition: z.enum(["new", "used"]),
    // condition: z.enum([
    //   "brand_new_unused",
    //   "like_new",
    //   "gently_used_excellent_condition",
    //   "good_condition",
    //   "fair_condition",
    //   "for_parts_or_not_working",
    // ]),
    images: z.array(z.any()).min(1, "At least one image is required"),
    buy_now_price: z.string().optional(),
    allow_offers: z.boolean().optional(),
    start_price: z.string().optional(),
    reserve_price: z.string().optional(),
    expire_at: z.date().optional(),
    payment_method_id: z.string().optional(),
    // quantity: z.number().optional(),
    // vehicle_type: z.string().min(1, "Vehicle Type is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(1, "Year is required"),
    part: z.string().optional(),
    fuel_type: z.string().optional(),
    transmission: z.string().optional(),
    body_style: z.string().optional(),
    odometer: z.string().optional(),
    engine_size: z.string().optional(),
    doors: z.string().optional(),
    seats: z.string().optional(),
    drive_type: z.string().optional(),
    color: z.string().optional(),
    import_history: z.string().optional(),
    listing_type: z.string().optional(),
    safety_rating: z.string().optional(),
    vin: z.string().optional(),
    registration: z.string().optional(),
    wof_expiry: z.string().optional(),
    rego_expiry: z.string().optional(),
  })
  .refine(
    (data) => {
      // Case 1: Buy now price is filled
      if (data.buy_now_price && data.buy_now_price.trim() !== "") {
        return true;
      }

      // Case 2: Both start and reserve price are filled
      if (
        data.start_price &&
        data.start_price.trim() !== "" &&
        data.reserve_price &&
        data.reserve_price.trim() !== ""
      ) {
        return true;
      }

      // Otherwise fail
      return false;
    },
    {
      message:
        "Either enter Buy Now Price, or both Start Price and Reserve Price",
      path: ["buy_now_price"], // error will show under buy_now_price by default
    }
  )
  .refine(
    (data) => {
      // Start Price cannot be greater than Buy Now Price
      if (
        data.buy_now_price &&
        data.buy_now_price.trim() !== "" &&
        data.start_price &&
        data.start_price.trim() !== ""
      ) {
        const buyNow = parseFloat(data.buy_now_price);
        const start = parseFloat(data.start_price);
        if (!isNaN(buyNow) && !isNaN(start) && start > buyNow) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Start Price cannot be greater than Buy Now Price",
      path: ["start_price"],
    }
  )
  .refine(
    (data) => {
      // Reserve Price cannot be greater than Buy Now Price
      if (
        data.buy_now_price &&
        data.buy_now_price.trim() !== "" &&
        data.reserve_price &&
        data.reserve_price.trim() !== ""
      ) {
        const buyNow = parseFloat(data.buy_now_price);
        const reserve = parseFloat(data.reserve_price);
        if (!isNaN(buyNow) && !isNaN(reserve) && reserve > buyNow) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Reserve Price cannot be greater than Buy Now Price",
      path: ["reserve_price"],
    }
  );

const steps = [
  { title: "Vehicle Type & Category", key: "vehicle-type" },
  { title: "Vehicle Details", key: "vehicle-details" },
  { title: "Photos", key: "photos" },
  { title: "Price & Payment", key: "price-payment" },
];

const vehicleTypes = [
  { key: "car", name: "Car", icon: Car, description: "Cars, SUVs, Utes, Vans" },
  {
    key: "motorbike",
    name: "Motorbike",
    icon: Motorbike,
    description: "Motorcycles, Scooters",
  },
  {
    key: "caravan",
    name: "Caravan & Motorhome",
    icon: Caravan,
    description: "Caravans, Motorhomes, Trailers",
  },
  {
    key: "boat",
    name: "Boat & Marine",
    icon: Sailboat,
    description: "Boats, Yachts, Jetskis",
  },
  {
    key: "parts",
    name: "Parts & Accessories",
    icon: Wrench,
    description: "Car parts, Accessories",
  },
];
// Vehicle data will be loaded dynamically from vehicles.json

const carPartsData = [
  {
    make: "Toyota",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Corolla", "Camry", "Yaris", "Avalon"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Land Cruiser", "Prado", "Hilux", "Fortuner"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["RAV4", "Fortuner", "Camry", "Corolla"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Radiator",
        compatibleModels: ["Land Cruiser", "Prado", "Hilux"],
        years: [
          2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
          2021, 2022, 2023, 2024,
        ],
      },
      {
        name: "Alternator",
        compatibleModels: ["Camry", "Corolla", "Yaris", "Avalon"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Windshield",
        compatibleModels: ["Land Cruiser", "Prado", "Hilux", "Fortuner"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "AC Compressor",
        compatibleModels: ["Land Cruiser", "Camry", "Prado"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Nissan",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Sunny", "Altima", "Maxima"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Patrol", "X-Terra", "Navara"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["X-Trail", "Patrol", "Altima"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Radiator",
        compatibleModels: ["Patrol", "X-Terra", "Navara"],
        years: [
          2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
          2021, 2022, 2023, 2024,
        ],
      },
      {
        name: "Alternator",
        compatibleModels: ["Sunny", "Altima", "Maxima"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Mitsubishi",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Lancer", "Outlander", "ASX"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Pajero", "Montero Sport", "L200"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Pajero", "Outlander", "Lancer"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Radiator",
        compatibleModels: ["Pajero", "Montero Sport", "L200"],
        years: [
          2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
          2021, 2022, 2023, 2024,
        ],
      },
    ],
  },
  {
    make: "Hyundai",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Elantra", "Accent", "Sonata"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Tucson", "Santa Fe", "Creta"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Tucson", "Santa Fe", "Elantra"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "AC Compressor",
        compatibleModels: ["Santa Fe", "Tucson", "Sonata"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Kia",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Cerato", "Rio", "Optima"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Sportage", "Sorento", "Carnival"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Sportage", "Sorento", "Cerato"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Honda",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Civic", "Accord", "City"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["CR-V", "Pilot", "HR-V"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["CR-V", "Accord", "Civic"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "AC Compressor",
        compatibleModels: ["Accord", "CR-V", "Pilot"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Ford",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Explorer", "Escape", "Focus"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Explorer", "Edge", "F-150"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Explorer", "Escape", "Focus"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Chevrolet",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Malibu", "Captiva", "Lumina"],
        years: [2015, 2016, 2017, 2018, 2019, 2020],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Tahoe", "Traverse", "Captiva"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Traverse", "Malibu", "Captiva"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "AC Compressor",
        compatibleModels: ["Tahoe", "Traverse", "Malibu"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Mercedes-Benz",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["C-Class", "E-Class", "S-Class"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["GLE", "GLC", "G-Class"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["C-Class", "E-Class", "GLE"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "BMW",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["3 Series", "5 Series", "X5"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["X5", "X3", "X6"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["3 Series", "5 Series", "X5"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Lexus",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["ES", "RX", "IS"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["LX", "GX", "RX"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["RX", "ES", "NX"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "AC Compressor",
        compatibleModels: ["LX", "RX", "GX"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Audi",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["A4", "A6", "Q5"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Q7", "Q5", "A6"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["A4", "A6", "Q5"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Isuzu",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["D-Max", "MU-X"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["D-Max", "MU-X"],
        years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Radiator",
        compatibleModels: ["D-Max", "MU-X"],
        years: [
          2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
          2021, 2022, 2023, 2024,
        ],
      },
    ],
  },
  {
    make: "Jeep",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Grand Cherokee", "Wrangler"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Grand Cherokee", "Wrangler", "Cherokee"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Grand Cherokee", "Wrangler"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    make: "Dodge",
    parts: [
      {
        name: "Headlight Assembly",
        compatibleModels: ["Charger", "Challenger"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Front Bumper",
        compatibleModels: ["Charger", "Challenger", "Durango"],
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      },
      {
        name: "Brake Pads Set",
        compatibleModels: ["Charger", "Challenger"],
        years: [2020, 2021, 2022, 2023, 2024],
      },
    ],
  },
];

const getMaxDate = () => {
  const today = new Date();

  today.setDate(today.getDate() + 60);
  return today;
};

const MotorListingForm = ({ initialValues, mode = "create" }) => {
  const methods = useForm({
    resolver: zodResolver(motorListingSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    reset,
    trigger,
    formState: { errors },
    control,
  } = methods;
  const watchedVehicleType = watch("vehicle_type");
  const watchedCategoryId = watch("category_id");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  
  // Helper function to check if a date is today
  const isToday = (date) => {
    if (!date) return false;
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modals, setModals] = useState([]);
  const [categoryStack, setCategoryStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vehicle_type, setVehicleType] = useState(
    categoryStack.length > 0 ? categoryStack?.[0]?.name : selectedCategory?.name
  );
  // const vehicle_type =
  //   categoryStack.length > 0 ? categoryStack?.[0]?.name : selectedCategory?.name;

  // Vehicle data state
  const [vehicleData, setVehicleData] = useState([]);
  const [loadingVehicleData, setLoadingVehicleData] = useState(false);

  const stepFields = [
    ["category_id"], // Step 0
    ["title", "description", "condition", "make", "model", "year"], // Step 1
    ["images"], // Step 2
    ["buy_now_price", "start_price", "reserve_price"], // Step 3
  ];

  // Load vehicle data based on vehicle type
  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vehicle_type) {
        setVehicleData([]);
        return;
      }

      setLoadingVehicleData(true);
      try {
        console.log("type", vehicle_type);
        const vehicleType = getVehicleTypeFromCategory(vehicle_type);
        const data = await getTransformedVehicleData(vehicleType);
        setVehicleData(data);
      } catch (error) {
        console.error("Error loading vehicle data:", error);
        setVehicleData([]);
      } finally {
        setLoadingVehicleData(false);
      }
    };

    loadVehicleData();
  }, [vehicle_type]);

  function parseCurrencyString(value) {
    if (typeof value !== "string") return value;
    // Remove commas, keep only digits and dots
    const parsed = value.replace(/,/g, "");
    if (parsed === "" || isNaN(parsed)) return "";
    // Preserve as string for the controlled input field
    return parsed;
  }

  const normalizedInitialValues = useMemo(() => {
    if (!initialValues) return {};

    const copy = { ...initialValues };

    Object.keys(copy).forEach((key) => {
      if (copy[key] === null) copy[key] = "";
    });

    // Convert currency fields to plain string suitable for number inputs
    ["winning_bid", "start_price", "reserve_price", "buy_now_price"].forEach(
      (key) => {
        if (copy[key] !== undefined && copy[key] !== null && copy[key] !== "") {
          copy[key] = parseCurrencyString(String(copy[key]));
        }
      }
    );

    // 1. Convert expire_at string to Date object
    if (copy.expire_at && typeof copy.expire_at === "string") {
      const date = new Date(copy.expire_at);
      copy.expire_at = isNaN(date.getTime()) ? null : date;
    }

    // 2. Convert 'allow_offers' string ("false") to boolean (false)
    if (copy.allow_offers) {
      copy.allow_offers =
        copy.allow_offers === "true" || copy.allow_offers === true;
    } else {
      copy.allow_offers = false;
    }

    // ✅ Vehicle data normalization – only adjust when incoming values exist in dataset
    if (vehicleData.length > 0 && copy.make) {
      const matchedMake = vehicleData.find(
        (brand) =>
          brand.make.toLowerCase().trim() === copy.make.toLowerCase().trim()
      );

      if (matchedMake) {
        copy.make = matchedMake.make;

        if (copy.model && matchedMake.models.length > 0) {
          const matchedModel = matchedMake.models.find(
            (m) =>
              m.name.toLowerCase().trim() === copy.model.toLowerCase().trim()
          );

          if (matchedModel) {
            copy.model = matchedModel.name;

            if (copy.year) {
              const numericYear = Number(copy.year);
              if (matchedModel.years.includes(numericYear)) {
                copy.year = String(numericYear);
              }
            }
          }
        }
      }
    }

    if (copy.year !== "" && copy.year !== null && copy.year !== undefined) {
      copy.year = String(copy.year);
    }

    return copy;
  }, [initialValues, vehicleData]);

  useEffect(() => {
    if (Object.keys(normalizedInitialValues).length > 0) {
      console.log("Reset triggered with data:", normalizedInitialValues);
      reset(normalizedInitialValues);
    }
  }, [initialValues, vehicleData, reset, normalizedInitialValues]);

  useEffect(() => {
    console.log("Reset Triggered:", {
      initialValues,
      vehicleDataLength: vehicleData.length,
    });
  }, [initialValues, vehicleData]);

  useEffect(() => {
    async function initCategoryForEdit() {
      if (
        mode === "edit" &&
        initialValues &&
        initialValues.category_id &&
        !selectedCategory
      ) {
        const res = await categoriesApi.getAllCategories(
          initialValues.category.parent_id,
          "motors"
        );
        const allCategories = res.data || res;
        const found = allCategories.find(
          (cat) => cat.id == initialValues.category.id
        );
        console.log(initialValues);
        if (found) {
          setSelectedCategory(found);
          setVehicleType(found?.name);
          setCategoryStack([found?.parent, found]);
        }
      }
    }
    initCategoryForEdit();
    // eslint-disable-next-line
  }, [mode, initialValues, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const listing_type = "motors";
      try {
        const { data } = await categoriesApi.getAllCategories(
          null,
          listing_type
        );
        // setCategories(data || []);
        console.log("Property dataaa", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchModals = async () => {
      try {
        const { data } = await motorsApi.getMotorModels();
        setModals(data || []);
        console.log("Modals", data);
      } catch (error) {
        console.error("Error fetching modals:", error);
      }
    };

    fetchCategories();
    fetchModals();
  }, []);

  useEffect(() => {
    const listing_type = "motors";
    if (isModalOpen) {
      setLoadingCategories(true);
      categoriesApi
        .getAllCategories("", listing_type)
        .then((cats) => {
          setCurrentCategories(cats.data || cats);
          setCategoryStack([]);
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [isModalOpen]);

  // Add these handlers if not already present
  const handleCategoryClick = async (cat) => {
    setLoadingCategories(true);
    try {
      const result = await categoriesApi.getAllCategories(cat.id, "motors");
      const children = result.data || result;
      console.log("aaaa result", result);
      console.log("aaaa children", children);
      if (children && children.length > 0) {
        setCategoryStack((prev) => [...prev, { id: cat.id, name: cat.name }]);
        setCurrentCategories(children);
      } else {
        setValue("category_id", cat.id);
        setSelectedCategory(cat);
        setVehicleType(cat.name);
        setIsModalOpen(false);
      }
    } finally {
      setLoadingCategories(false);
    }
  };
  const handleBackCategory = async () => {
    if (categoryStack.length === 0) return;
    setLoadingCategories(true);
    const newStack = [...categoryStack];
    newStack.pop();
    let parentId =
      newStack.length > 0 ? newStack[newStack.length - 1].id : undefined;
    const result = await categoriesApi.getAllCategories(parentId, "motors");
    setCurrentCategories(result.data || result);
    setCategoryStack(newStack);
    setLoadingCategories(false);
  };

  useEffect(() => {
    if (watchedVehicleType && watchedVehicleType !== selectedVehicleType) {
      setSelectedVehicleType(watchedVehicleType);
      setValue("make", "");
      setValue("model", "");
    }
  }, [watchedVehicleType, setValue, selectedVehicleType]);
  useEffect(() => {
    console.log("🚨 Validation Errors:", errors);
  }, [errors]);

  // Clear reserve_price when start_price is empty
  const startPrice = watch("start_price");
  useEffect(() => {
    if (!startPrice || startPrice.trim() === "") {
      setValue("reserve_price", "", { shouldValidate: false });
    }
  }, [startPrice, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Basic fields
      formData.append("listing_type", "motors");
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle || "");
      formData.append("category_id", data.category_id || 1);
      formData.append("description", data.description);
      formData.append("condition", data.condition || "new");
      formData.append("buy_now_price", data.buy_now_price || "");
      formData.append("allow_offers", data.allow_offers ? "1" : "0");
      formData.append("start_price", data.start_price || "");
      formData.append("reserve_price", data.reserve_price || "");
      formData.append("pickup_option", 1);
      if (data.expire_at) {
        formData.append("expire_at", data.expire_at.toISOString());
      }

      formData.append("payment_method_id", data.payment_method_id || "");
      // formData.append("quantity", data.quantity || "1");

      const motorFields = [
        "vehicle_type",
        "make",
        "model",
        "year",
        "fuel_type",
        "transmission",
        "body_style",
        "odometer",
        "engine_size",
        "doors",
        "seats",
        "drive_type",
        "color",
        "import_history",
        "listing_type",
        "safety_rating",
        "vin",
        "registration",
        "wof_expiry",
        "rego_expiry",
        "license_plate",
        "allow_offers",
      ];

      let attributeIndex = 0;
      motorFields.forEach((field) => {
        const value = data[field];

        if (typeof value === "string" && value.trim() !== "") {
          formData.append(`attributes[${attributeIndex}][key]`, field);
          formData.append(`attributes[${attributeIndex}][value]`, value.trim());
          attributeIndex++;
        } else if (
          (typeof value === "number" && !isNaN(value)) ||
          typeof value === "boolean" ||
          value instanceof Date
        ) {
          formData.append(`attributes[${attributeIndex}][key]`, field);
          formData.append(
            `attributes[${attributeIndex}][value]`,
            value instanceof Date ? value.toISOString() : value.toString()
          );
          attributeIndex++;
        }
      });

      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      // const response = await listingsApi.createListing(formData);
      // toast.success("Motor listing created successfully!");
      let response;
      if (mode === "edit" && initialValues.slug) {
        response = await listingsApi.updateListing(
          initialValues.slug,
          formData
        );
        toast.success("Motor listing updated successfully!");
      } else {
        response = await listingsApi.createListing(formData);
        toast.success("Motor listing created successfully!");
      }

      if (response && response.slug) {
        router.push(`/listing/viewlisting?slug=${response.slug}`);
      } else {
        router.push("/account");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating motor listing:", error);

      // Handle API validation errors
      const validationErrors = error?.data?.data || error?.response?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        // Fallback to general error message
        const errorMessage =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create motor listing. Please try again.";
        toast.error(errorMessage);
      }
    }
    // finally {
    //   setIsSubmitting(false);
    // }
  };

  // const nextStep = () => {
  //   if (activeStep < steps.length - 1) {
  //     setActiveStep(activeStep + 1);
  //   }
  // };
  const nextStep = async () => {
    if (activeStep >= steps.length - 1) return;

    // Get the fields specific to the current step
    const fieldsToValidate = stepFields[activeStep];

    // Use r-h-f's trigger to validate only the necessary fields
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setActiveStep(activeStep + 1);
    } else {
      // The Zod resolver automatically sets errors, and r-h-f should focus on the first error.
      toast.error("Please fill out all required fields before continuing.");
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderVehicleTypeStep();
      case 1:
        return renderVehicleDetailsStep();
      case 2:
        return renderPhotosStep();
      case 3:
        return renderPricePaymentStep();
      default:
        return null;
    }
  };
  const conditions = [
    {
      key: "new",
      label: "New",
    },
    {
      key: "used",
      label: "Used",
    },
  ];

  const renderVehicleTypeStep = () => {
    const category_id = watch("category_id");
    // Modal open handler
    const openCategoryModal = () => setIsModalOpen(true);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What are you listing?
          </h2>
          <p className="text-lg text-gray-600">
            Choose the type of vehicle or part you want to sell
          </p>
        </div>

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        {category_id && selectedCategory ? (
          <div className="flex justify-between items-center">
            <p className="text-base text-green-600 font-semibold">
              {selectedCategory?.name}
            </p>
            <button
              type="button"
              onClick={openCategoryModal}
              className="text-sm text-green-600 hover:underline"
            >
              {t("Change")}
            </button>
          </div>
        ) : (
          <div onClick={openCategoryModal} className="cursor-pointer">
            <p className="text-green-600 font-medium">
              {" "}
              {t("Choose category")}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t("We'll suggest a category based on your title, too.")}
            </p>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-2">
                {errors.category_id.message}
              </p>
            )}
          </div>
        )}
        {/* </div> */}

        {watchedCategoryId && (
          <div className="flex justify-between pt-6">
            <Button
              onClick={nextStep}
              className="flex items-center justify-center w-36"
              disabled={!watchedCategoryId}
            >
              <span className="flex items-center justify-center w-full">
                <span className="flex-1 text-center">Continue</span>
                <IoIosArrowForward className="flex-shrink-0" />
              </span>
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderVehicleDetailsStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Vehicle Details
        </h2>
        <p className="text-lg text-gray-600">Tell us about your vehicle</p>
      </div>

      {vehicle_type === "Car parts & accessories" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Car Part Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Toyota Corolla Headlight"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <Controller
                name="make"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SearchableDropdownWithCustom
                    options={carPartsData.map((brand) => brand.make)}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select or type brand"
                    searchPlaceholder="Search brands..."
                    emptyMessage="No brands found"
                    customLabel="Brand not in list? Type it yourself"
                    customPlaceholder="Enter brand name"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part / Accessory *
              </label>
              <Controller
                name="part"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const selectedBrand = watch("make");
                  const parts =
                    carPartsData.find((b) => b.make === selectedBrand)?.parts ||
                    [];
                  return (
                    <SearchableDropdownWithCustom
                      options={parts.map((part) => part.name)}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select or type part"
                      disabled={!selectedBrand}
                      searchPlaceholder="Search parts..."
                      emptyMessage="No parts found"
                      customLabel="Part not in list? Type it yourself"
                      customPlaceholder="Enter part name"
                    />
                  );
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compatible Model *
              </label>
              <Controller
                name="model"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const selectedBrand = watch("make");
                  const selectedPart = watch("part");
                  const models =
                    carPartsData
                      .find((b) => b.make === selectedBrand)
                      ?.parts.find((p) => p.name === selectedPart)
                      ?.compatibleModels || [];
                  return (
                    <SearchableDropdownWithCustom
                      options={models}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select or type model"
                      disabled={!selectedPart}
                      searchPlaceholder="Search models..."
                      emptyMessage="No models found"
                      customLabel="Model not in list? Type it yourself"
                      customPlaceholder="Enter model name"
                    />
                  );
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <Controller
                name="year"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const selectedBrand = watch("make");
                  const selectedPart = watch("part");
                  const selectedModel = watch("model");
                  const years =
                    carPartsData
                      .find((b) => b.make === selectedBrand)
                      ?.parts.find((p) => p.name === selectedPart)?.years || [];
                  return (
                    <SearchableDropdownWithCustom
                      options={years.map((year) => year.toString())}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select or type year"
                      disabled={!selectedModel}
                      searchPlaceholder="Search years..."
                      emptyMessage="No years found"
                      customLabel="Year not in list? Type it yourself"
                      customPlaceholder="Enter year (e.g., 2024)"
                    />
                  );
                }}
              />
            </div>

            {/* Condition */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label> */}
              {/* <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" {...field} value="new" className="mr-2"/> New</label>
              <label className="flex items-center"><input type="radio" {...field} value="used" className="mr-2"/> Used</label>
            </div>
          )}
        /> */}
              {conditions.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  <input
                    type="radio"
                    value={item.key}
                    {...register("condition")}
                    // checked={condition === item.key}
                    className="accent-green-500"
                  />
                  <span className="text-sm">{t(item.label)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <Controller
                name="color"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter color name (e.g., red)"
                  />
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="rounded-md">
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                      placeholder="Enter Description"
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {vehicle_type !== "Car parts & accessories" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value ?? ""}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 2020 Toyota Corolla Hybrid"
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <Controller
                name="make"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SearchableDropdownWithCustom
                    options={vehicleData.map((vehicle) => vehicle.make)}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Select or type brand"
                    disabled={loadingVehicleData}
                    loading={loadingVehicleData}
                    searchPlaceholder="Search brands..."
                    emptyMessage="No brands found"
                    customLabel="Brand not in list? Type it yourself"
                    customPlaceholder="Enter brand name"
                  />
                )}
              />
              {errors.make && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.make.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <Controller
                name="model"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const selectedBrand = watch("make");
                  const models =
                    vehicleData.find(
                      (vehicle) => vehicle.make === selectedBrand
                    )?.models || [];

                  return (
                    <SearchableDropdownWithCustom
                      options={models.map((model) => model.name)}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select or type model"
                      disabled={!selectedBrand || loadingVehicleData}
                      loading={loadingVehicleData}
                      searchPlaceholder="Search models..."
                      emptyMessage="No models found"
                      customLabel="Model not in list? Type it yourself"
                      customPlaceholder="Enter model name"
                    />
                  );
                }}
              />
              {errors.model && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.model.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <Controller
                name="year"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const selectedBrand = watch("make");
                  const selectedModel = watch("model");
                  const years = (
                    vehicleData
                      .find((vehicle) => vehicle.make === selectedBrand)
                      ?.models.find((m) => m.name === selectedModel)?.years ||
                    []
                  )
                    .slice()
                    .sort((a, b) => b - a);

                  return (
                    <SearchableDropdownWithCustom
                      options={years.map((year) => year.toString())}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Select or type year"
                      disabled={!selectedModel || loadingVehicleData}
                      loading={loadingVehicleData}
                      searchPlaceholder="Search years..."
                      emptyMessage="No years found"
                      customLabel="Year not in list? Type it yourself"
                      customPlaceholder="Enter year (e.g., 2024)"
                    />
                  );
                }}
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2 grid grid-cols-1 md:grid-cols-2">
                    {conditions.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                      >
                        <input
                          type="radio"
                          value={item.key}
                          checked={field.value === item.key}
                          onChange={() => field.onChange(item.key)}
                          className="accent-green-500"
                        />
                        <span className="text-sm">{t(item.label)}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
            {/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PickUp Option
            </label>
            <Controller
              name="pickup_option"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Pickup Option</option>
                  <option value="available">Available</option>
                  <option value="no_pickup">No Pickup</option>
                  <option value="must_pickup">Must Pickup</option>
                </select>
              )}
            />
          </div> */}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Additional Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <Controller
                name="fuel_type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="LPG">LPG</option>
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                )}
              />
            </div>

            {/* {watchedVehicleType === "car" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Style
              </label>
              <Controller
                name="body_style"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Body Style</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Ute">Ute</option>
                    <option value="Van">Van</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Wagon">Wagon</option>
                  </select>
                )}
              />
            </div>
          )} */}

            <div className="hidden md:block mt-12" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometers
              </label>
              <Controller
                name="odometer"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                        field.onChange(value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50000"
                  />
                )}
              />
            </div>

            <div className="hidden md:block mt-12" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <Controller
                name="color"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter color name (e.g., red)"
                  />
                )}
              />
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>

            <div className="hidden md:block mt-12" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="rounded-md">
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                      placeholder="Enter Description"
                    />
                  </div>
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex items-center justify-center w-36"
        >
          <span className="flex items-center justify-center w-full">
            <IoIosArrowBack className="flex-shrink-0" />
            <span className="flex-1 text-center">Back</span>
          </span>
        </Button>
        <Button
          onClick={nextStep}
          className="flex items-center justify-center w-36"
        >
          <span className="flex items-center justify-center w-full">
            <span className="flex-1 text-center">Continue</span>
            <IoIosArrowForward className="flex-shrink-0" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderPhotosStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Photos</h2>
        <p className="text-lg text-gray-600">
          Add photos of your {watchedVehicleType}
        </p>
      </div>

      <UploadPhotos />

      <div className="flex justify-between pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex items-center justify-center w-36"
        >
          <span className="flex items-center justify-center w-full">
            <IoIosArrowBack className="flex-shrink-0" />
            <span className="flex-1 text-center">Back</span>
          </span>
        </Button>
        <Button
          onClick={nextStep}
          className="flex items-center justify-center w-36"
        >
          <span className="flex items-center justify-center w-full">
            <span className="flex-1 text-center">Continue</span>
            <IoIosArrowForward className="flex-shrink-0" />
          </span>
        </Button>
      </div>
    </div>
  );

  const renderPricePaymentStep = () => {
    const categoryId = watch("category_id");
    const startPrice = watch("start_price");
    const buyNowPrice = watch("buy_now_price");
    const isReservePriceDisabled = !startPrice || startPrice.trim() === "";
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Price & Payment
          </h2>
          <p className="text-lg text-gray-600">
            Set your pricing and payment options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Pricing</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buy Now Price
              </label>
              <Controller
                name="buy_now_price"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 price">$</span>
                    </div>
                    <input
                      {...field}
                      type="number"
                      min="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseFloat(value);
                        if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                          field.onChange(value);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pl-8 pr-3 py-2
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter price"
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allow Offers
              </label>
              <Controller
                name="allow_offers"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mr-2"
                    />
                    Accept offers from buyers
                  </label>
                )}
              />
            </div>
            {/* )} */}

            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Price
                </label>
                <Controller
                  name="start_price"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 price">$</span>
                      </div>
                      <input
                        {...field}
                        type="number"
                        min="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = parseFloat(value);
                          if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                            field.onChange(value);
                          }
                        }}
                        className={`w-full border rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500 pl-8 pr-3 py-2
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
      ${errors.start_price ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter start price"
                      />
                    </div>
                  )}
                />
                {errors.start_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.start_price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserve Price
                </label>
                <Controller
                  name="reserve_price"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 price">$</span>
                      </div>
                      <input
                        {...field}
                        type="number"
                        min="0"
                        disabled={isReservePriceDisabled}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = parseFloat(value);
                          if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                            field.onChange(value);
                          }
                        }}
                        className={`w-full border rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500 pl-8 pr-3 py-2
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
      ${errors.reserve_price ? "border-red-500" : "border-gray-300"}
      ${
        isReservePriceDisabled
          ? "bg-gray-100 cursor-not-allowed opacity-60"
          : ""
      }`}
                        placeholder="Enter reserve price"
                      />
                    </div>
                  )}
                />
                {errors.reserve_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reserve_price.message}
                  </p>
                )}
                {isReservePriceDisabled && (
                  <p className="text-gray-500 text-xs mt-1">
                    Please enter Start Price first
                  </p>
                )}
              </div>
            </>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Additional Options
            </h3>

            {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
          <Controller
  name="quantity"
  control={control}
  render={({ field }) => (
    <input
      {...field}
      type="number"
      min="1"
      defaultValue="1"
      className="w-full px-3 py-2 border border-gray-300 rounded-md 
      focus:outline-none focus:ring-2 focus:ring-green-500
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="1"
    />
  )}
/>

          </div> */}

            {/* <div> */}

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date & Time
              </label>
              <Controller
                control={control}
                name="expire_at"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) =>
                      setValue("expire_at", date, { shouldValidate: true })
                    }
                    showTimeSelect
                    timeFormat="hh:mm aa"
                    dateFormat="yyyy-MM-dd h:mm aa"
                    minDate={new Date()}
                    maxDate={getMaxDate()}
                    filterTime={(time) => {
                      const now = new Date();
                      const selectedDate = field.value;
                      if (selectedDate && isToday(selectedDate)) {
                        return time.getTime() >= now.getTime();
                      }
                      return true;
                    }}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring
                          [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                          ${
                            errors.expire_at
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-green-400"
                          }`}
                    placeholderText={t("Select date and time")}
                  />
                )}
              />
              {errors.expire_at && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expire_at.message}
                </p>
              )}
            </div>
            {/* </div> */}

            {/* {watchedVehicleType !== "Car parts & accessories" && (
              <>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN Number
                </label>
                <Controller
                  name="vin"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Vehicle Identification Number"
                    />
                  )}
                />
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration
                  </label>
                  <Controller
                    name="registration"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="License plate number"
                      />
                    )}
                  />
                </div>
              </>
            )} */}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            onClick={prevStep}
            variant="outline"
            className="px-6 py-2 flex items-center"
          >
            <IoIosArrowBack className="mr-2" />
            Back
          </Button>
          <Button
            onClick={() => handleSubmit(onSubmit)()}
            className="px-6 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t(mode === "edit" ? "Updating..." : "Creating...")
              : t(mode === "edit" ? "Update Listing" : "Create Listing")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= activeStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index <= activeStep ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-4 ${
                    index < activeStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* {renderStepContent()} */}

          {renderStepContent()}
          {isModalOpen && (
            <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              categoryStack={categoryStack}
              handleBackCategory={handleBackCategory}
              currentCategories={currentCategories}
              handleCategoryClick={handleCategoryClick}
              loadingCategories={loadingCategories}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default MotorListingForm;
