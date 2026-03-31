import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import MobileBottomNav from "@/components/store/MobileBottomNav";
import ProductCard from "@/components/store/ProductCard";
import SmartBanner from "@/components/store/SmartBanner";
import InlineBanner from "@/components/store/InlineBanner";

import { useStore } from "@/context/StoreContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { categories } from "@/data/store";

/* ================= BANNER IMAGES ================= */

import bannerBrake from "@/assets/product-brake-disc.png";
import bannerTyre from "@/assets/product-tire.png";
import bannerBattery from "@/assets/product-battery.png";
import bannerOil from "@/assets/product-air-filter.png";
import bannerSuspension from "@/assets/product-suspension.png";

/* ================= CONFIG ================= */

const PRODUCTS_PER_PAGE = 12;

/* Shuffle Function */

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const ShopPage = () => {

  const { products, searchQuery, setSearchQuery } =
    useStore();

  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [sortBy, setSortBy] =
    useState("default");

  const [localSearch, setLocalSearch] =
    useState(searchQuery);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [shuffledProducts, setShuffledProducts] =
    useState(products);

  /* ================= SIDE BANNERS ================= */

  const leftBanners = [

    {
      image: bannerBrake,
      link: "/shop?category=Brakes",
      category: "Brakes",
    },

    {
      image: bannerTyre,
      link: "/shop?category=Tyres",
      category: "Tyres",
    },

    {
      image: bannerBattery,
      link: "/shop?category=Battery",
      category: "Battery",
    },

  ];

  const rightBanners = [

    {
      image: bannerOil,
      link: "/shop?category=Engine Oil",
      category: "Engine Oil",
    },

    {
      image: bannerSuspension,
      link: "/shop?category=Suspension",
      category: "Suspension",
    },

    {
      image: bannerTyre,
      link: "/shop?category=Tyres",
      category: "Tyres",
    },

  ];

  /* ================= INLINE BANNERS ================= */

  const inlineBanners = [

    {
      image: bannerBrake,
      link: "/shop?category=Brakes",
      text: "🔥 Up to 20% Off Brake Parts",
    },

    {
      image: bannerTyre,
      link: "/shop?category=Tyres",
      text: "🚗 Get Your Tires Checked Today!",
    },

    {
      image: bannerBattery,
      link: "/shop?category=Battery",
      text: "⚡ Power Up with New Batteries",
    },

  ];

  /* ================= URL PARAMS ================= */

  const urlCategory =
    searchParams.get("category") || "";

  const urlQuery =
    searchParams.get("q") || "";

  /* ================= SHUFFLE ================= */

  useEffect(() => {

    setShuffledProducts(
      shuffleArray(products)
    );

  }, [products]);

  /* ================= CATEGORY ================= */

  useEffect(() => {

    if (urlCategory) {

      setSelectedCategory(
        urlCategory
      );

    }

  }, [urlCategory]);

  /* ================= SEARCH ================= */

  useEffect(() => {

    if (urlQuery) {

      setLocalSearch(urlQuery);

      setSearchQuery(urlQuery);

    }

  }, [urlQuery]);

  useEffect(() => {

    setLocalSearch(searchQuery);

  }, [searchQuery]);

  /* ================= RESET PAGE ================= */

  useEffect(() => {

    setCurrentPage(1);

  }, [selectedCategory, localSearch, sortBy]);

  /* ================= FILTER ================= */

  let filtered = shuffledProducts.filter(
    (p) => {

      const matchesCategory =
        !selectedCategory ||
        p.category === selectedCategory;

      const q =
        localSearch || searchQuery;

      const matchesSearch =
        !q ||
        p.name
          .toLowerCase()
          .includes(q.toLowerCase()) ||
        p.category
          .toLowerCase()
          .includes(q.toLowerCase()) ||
        (p.description || "")
          .toLowerCase()
          .includes(q.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch
      );

    }
  );

  /* ================= SORT ================= */

  if (sortBy === "price-low") {

    filtered.sort(
      (a, b) => a.price - b.price
    );

  }

  if (sortBy === "price-high") {

    filtered.sort(
      (a, b) => b.price - a.price
    );

  }

  if (sortBy === "rating") {

    filtered.sort(
      (a, b) => b.rating - a.rating
    );

  }

  /* ================= PAGINATION ================= */

  const totalPages =
    Math.ceil(
      filtered.length /
      PRODUCTS_PER_PAGE
    );

  const startIndex =
    (currentPage - 1) *
    PRODUCTS_PER_PAGE;

  const paginatedProducts =
    filtered.slice(
      startIndex,
      startIndex +
      PRODUCTS_PER_PAGE
    );

  return (

    <div className="min-h-screen bg-background pb-16 md:pb-0">

      <StoreHeader />

      <div className="container py-6">

        {/* ================= GRID ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

          {/* LEFT SIDE */}

          <div className="hidden lg:block lg:col-span-1">

            <div className="sticky top-24 space-y-4">

              <SmartBanner
                banners={leftBanners}
                selectedCategory={selectedCategory}
                interval={5000}
              />

              <SmartBanner
                banners={leftBanners}
                selectedCategory={selectedCategory}
                interval={6500}
              />

            </div>

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-4 lg:col-span-1">

            {/* SEARCH */}

            <div className="bg-card border rounded-lg p-4">

              <h3 className="font-semibold text-sm mb-3">
                Search
              </h3>

              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => {

                  setLocalSearch(
                    e.target.value
                  );

                  setSearchQuery(
                    e.target.value
                  );

                }}
                className="w-full border rounded px-3 py-2 text-sm"
              />

            </div>

            {/* CATEGORIES */}

            <div className="bg-card border rounded-lg p-4">

              <h3 className="font-semibold text-sm mb-3">
                Categories
              </h3>

              <ul className="space-y-1.5">

                <li>

                  <button
                    onClick={() =>
                      setSelectedCategory("")
                    }
                    className="text-xs w-full text-left py-1 px-2 rounded hover:bg-muted"
                  >
                    All Products
                  </button>

                </li>

                {categories.map((cat) => (

                  <li key={cat.name}>

                    <button
                      onClick={() =>
                        setSelectedCategory(
                          cat.name
                        )
                      }
                      className="text-xs w-full text-left py-1 px-2 rounded hover:bg-muted"
                    >

                      {cat.name}

                    </button>

                  </li>

                ))}

              </ul>

            </div>

          </aside>

          {/* PRODUCTS */}

          <div className="lg:col-span-3">

            {/* TOP BAR */}

            <div className="flex justify-between items-center mb-4">

              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} products
              </p>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="border rounded px-3 py-1.5 text-xs"
              >

                <option value="default">
                  Default Sorting
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>

              </select>

            </div>

            {/* PRODUCT GRID */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

              {paginatedProducts.map(
                (product, index) => {

                  const showBanner =
                    index > 0 &&
                    index % 8 === 0;

                  return (

                    <>

                      {showBanner && (

                        <InlineBanner
                          key={`banner-${index}`}
                          banners={inlineBanners}
                        />

                      )}

                      <ProductCard
                        key={product.id}
                        product={product}
                      />

                    </>

                  );

                }
              )}

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

              <div className="flex justify-center mt-8 gap-2 flex-wrap">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  className="px-3 py-1 text-sm border rounded"
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, i) => (

                    <button
                      key={i}
                      onClick={() =>
                        setCurrentPage(i + 1)
                      }
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === i + 1
                          ? "bg-primary text-white"
                          : ""
                      }`}
                    >

                      {i + 1}

                    </button>

                  )
                )}

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
                  className="px-3 py-1 text-sm border rounded"
                >
                  Next
                </button>

              </div>

            )}

          </div>

          {/* RIGHT SIDE */}

          <div className="hidden lg:block lg:col-span-1">

            <div className="sticky top-24 space-y-4">

              <SmartBanner
                banners={rightBanners}
                selectedCategory={selectedCategory}
                interval={4000}
              />

              <SmartBanner
                banners={rightBanners}
                selectedCategory={selectedCategory}
                interval={7000}
              />

            </div>

          </div>

        </div>

      </div>

      <StoreFooter />
      <MobileBottomNav />

    </div>

  );

};

export default ShopPage;