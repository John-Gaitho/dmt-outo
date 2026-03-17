import productBrakeDisc from "@/assets/product-brake-disc.png";
import productTire from "@/assets/product-tire.png";
import productHeadlight from "@/assets/product-headlight.png";
import productAirFilter from "@/assets/product-air-filter.png";
import productBattery from "@/assets/product-battery.png";
import productSuspension from "@/assets/product-suspension.png";
import productOil from "@/assets/product-oil.png";
import Productshell from "@/assets/product-shell.png";

/* ================= TYPES ================= */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  deal?: boolean;
  discount?: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  customer: string;
  email: string;
}

export interface Category {
  name: string;
  count: number;
}

/* ================= PRODUCTS ================= */

export const products: Product[] = [
  {
    id: "1",
    name: "NRG Innovations 3-Spoke Chameleon Classic Steering Wheel",
    price: 19.12,
    originalPrice: 24,
    category: "Air & Fuel Delivery",
    image: productBrakeDisc,
    rating: 5,
    reviews: 12,
    inStock: true,
    deal: true,
    discount: 20,
  },

  {
    id: "2",
    name: "Pierce PS Series Self-Recovery Electric Winch",
    price: 35.9,
    category: "Exterior & Accessories",
    image: productTire,
    rating: 5,
    reviews: 8,
    inStock: true,
    deal: true,
  },

  {
    id: "3",
    name: "FUEL D556 COUPLER Black with Machined Accents",
    price: 12.9,
    category: "Headlights & Lighting",
    subcategory: "Bulbs",
    image: productHeadlight,
    rating: 4,
    reviews: 15,
    inStock: true,
    featured: true,
  },

  {
    id: "4",
    name: "Grant Revolution Style Air-Bag Replacement Wheel",
    price: 12.9,
    category: "Headlights & Lighting",
    subcategory: "Car Reflectors",
    image: productAirFilter,
    rating: 3,
    reviews: 6,
    inStock: true,
    featured: true,
  },

  {
    id: "5",
    name: "AWS Tuning OFG 304 SS Cat-Back Exhaust System",
    price: 18.9,
    category: "Headlights & Lighting",
    subcategory: "Running Lights",
    image: productSuspension,
    rating: 4,
    reviews: 22,
    inStock: true,
    featured: true,
  },

  {
    id: "6",
    name: "Pierce PS Series Electric Motor",
    price: 35.9,
    category: "Headlights & Lighting",
    subcategory: "Door Light",
    image: productTire,
    rating: 5,
    reviews: 10,
    inStock: true,
    featured: true,
  },

  {
    id: "7",
    name: "NRG Innovations Chrome Classic Wheel",
    price: 19,
    originalPrice: 24,
    category: "Brakes & Rotors",
    subcategory: "ABS",
    image: productBrakeDisc,
    rating: 5,
    reviews: 18,
    inStock: true,
    discount: 20,
  },

  {
    id: "8",
    name: "ReadyLIFT Front Leveling Kit",
    price: 9,
    category: "Brakes & Rotors",
    subcategory: "Brake Booster",
    image: productOil,
    rating: 4,
    reviews: 5,
    inStock: true,
  },

  {
    id: "9",
    name: "Covercraft Outdoor Car Cover",
    price: 14.5,
    originalPrice: 18,
    category: "Brakes & Rotors",
    subcategory: "Brake Calipers",
    image: productBattery,
    rating: 4,
    reviews: 9,
    inStock: true,
    discount: 15,
  },

  {
    id: "10",
    name: "Pierce Electric Compressor",
    price: 35.9,
    category: "Brakes & Rotors",
    subcategory: "Brake Cylinder",
    image: productTire,
    rating: 5,
    reviews: 14,
    inStock: true,
  },

  {
    id: "11",
    name: "Premium Synthetic Motor Oil 5W-30",
    price: 29.99,
    originalPrice: 39.99,
    category: "Engines & Components",
    image: productOil,
    rating: 5,
    reviews: 45,
    inStock: true,
    discount: 25,
  },

  {
    id: "12",
    name: "Heavy Duty Car Battery 12V 750CCA",
    price: 89.99,
    category: "Electrical",
    image: productBattery,
    rating: 4,
    reviews: 33,
    inStock: true,
  },

  {
    id: "13",
    name: "Pierce PS Series Self-Recovery Electric Winch",
    price: 35.9,
    category: "Exterior & Accessories",
    image: Productshell,
    rating: 5,
    reviews: 8,
    inStock: true,
    deal: true,
  },
];

/* ================= AUTO GENERATED CATEGORIES ================= */

export const categories: Category[] = Array.from(
  new Set(products.map((p) => p.category))
).map((category) => ({
  name: category,
  count: products.filter((p) => p.category === category).length,
}));

/* ================= CATEGORY IMAGE HELPER ================= */

export const getCategoryImage = (categoryName: string) => {
  const product = products.find((p) => p.category === categoryName);
  return product?.image || "";
};

/* ================= SAMPLE ORDERS ================= */

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    items: [{ product: products[0], quantity: 2 }],
    total: 38.24,
    status: "delivered",
    date: "2026-03-10",
    customer: "John Smith",
    email: "john@example.com",
  },

  {
    id: "ORD-002",
    items: [
      { product: products[2], quantity: 1 },
      { product: products[4], quantity: 1 },
    ],
    total: 31.8,
    status: "processing",
    date: "2026-03-14",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
  },

  {
    id: "ORD-003",
    items: [{ product: products[10], quantity: 3 }],
    total: 89.97,
    status: "shipped",
    date: "2026-03-15",
    customer: "Mike Davis",
    email: "mike@example.com",
  },

  {
    id: "ORD-004",
    items: [{ product: products[11], quantity: 1 }],
    total: 89.99,
    status: "pending",
    date: "2026-03-16",
    customer: "Emily Chen",
    email: "emily@example.com",
  },
];

/* ================= CAR DATA ================= */

export const carMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Nissan",
  "Hyundai",
  "Kia",
];

export const carModels: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Bronco"],
  Chevrolet: ["Silverado", "Malibu", "Equinox", "Tahoe", "Camaro"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
  Audi: ["A4", "A6", "Q5", "Q7", "A3"],
  Nissan: ["Altima", "Rogue", "Sentra", "Pathfinder", "Frontier"],
  Hyundai: ["Elantra", "Tucson", "Santa Fe", "Sonata", "Kona"],
  Kia: ["Forte", "Sportage", "Telluride", "Sorento", "Seltos"],
};

export const carYears = Array.from({ length: 30 }, (_, i) =>
  (2026 - i).toString()
);

export const carClasses = [
  "Sedan",
  "SUV",
  "Truck",
  "Coupe",
  "Hatchback",
  "Van",
  "Wagon",
];