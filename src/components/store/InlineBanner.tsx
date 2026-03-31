import { useEffect, useState } from "react";

type Banner = {
  image: string;
  link?: string;
  text?: string;
};

type Props = {
  banners: Banner[];
  interval?: number;
};

const InlineBanner = ({
  banners,
  interval = 5000,
}: Props) => {

  const [index, setIndex] = useState(0);

  /* Random Start */

  useEffect(() => {

    if (banners.length > 0) {

      setIndex(
        Math.floor(
          Math.random() *
          banners.length
        )
      );

    }

  }, [banners]);

  /* Auto Rotate */

  useEffect(() => {

    if (banners.length <= 1)
      return;

    const timer = setInterval(() => {

      setIndex(
        (prev) =>
          (prev + 1) %
          banners.length
      );

    }, interval);

    return () => clearInterval(timer);

  }, [banners, interval]);

  if (banners.length === 0)
    return null;

  const banner = banners[index];

  return (

    <a
      href={banner.link || "#"}
      className="block col-span-full"
    >

      <div className="relative h-[150px] w-full overflow-hidden rounded-lg border border-border">

        {/* Banner Image */}

        <img
          src={banner.image}
          alt="Promotion"
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/40 flex items-center px-6">

          <p className="text-white text-sm md:text-base font-semibold">

            {banner.text || "Special Offer Available"}

          </p>

        </div>

      </div>

    </a>

  );

};

export default InlineBanner;