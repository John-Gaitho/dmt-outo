import { useEffect, useState } from "react";

type Banner = {
  image: string;
  link?: string;
  category?: string;
};

type Props = {
  banners: Banner[];
  selectedCategory?: string;
  interval?: number;
};

const SmartBanner = ({
  banners,
  selectedCategory,
  interval = 9000,
}: Props) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  /* Filter banners by category */

  const filteredBanners =
    selectedCategory
      ? banners.filter(
          (b) =>
            !b.category ||
            b.category === selectedCategory
        )
      : banners;

  /* Random starting banner */

  useEffect(() => {

    if (filteredBanners.length > 0) {

      const randomStart =
        Math.floor(
          Math.random() *
          filteredBanners.length
        );

      setCurrentIndex(randomStart);

    }

  }, [selectedCategory]);

  /* Auto rotate */

  useEffect(() => {

    if (filteredBanners.length <= 1)
      return;

    const timer = setInterval(() => {

      setCurrentIndex((prev) =>
        (prev + 1) %
        filteredBanners.length
      );

    }, interval);

    return () => clearInterval(timer);

  }, [filteredBanners, interval]);

  if (filteredBanners.length === 0)
    return null;

  const banner =
    filteredBanners[currentIndex % filteredBanners.length];

  if (!banner) return null;

  return (

    <a
      href={banner.link || "#"}
      className="block"
    >

      <img
        src={banner.image}
        alt="Promotion"
        loading="lazy"
        className="w-full rounded-lg border border-border object-cover hover:opacity-95 transition"
      />

    </a>

  );

};

export default SmartBanner;