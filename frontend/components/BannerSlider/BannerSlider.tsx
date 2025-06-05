"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import "./BannerSlider.scss";

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
}

export default function HomeBannerSlider({ slides }: Props) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
    mode: "snap",
  });

  return (
    <div ref={sliderRef} className="keen-slider banner-slider">
      {slides.map((slide, index) => (
        <div key={index} className="keen-slider__slide">
          <Image
            src={slide.src}
            alt={slide.alt}
            width={1200}
            height={300}
            className="banner-image"
            priority
          />
        </div>
      ))}
    </div>
  );
}
