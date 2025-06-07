"use client";

import 'keen-slider/keen-slider.min.css';
import './BannerSlider.scss';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[];
}

export default function BannerSlider({ slides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <>
      <div className="banner-slider-container">
        <div
          ref={sliderRef}
          className="keen-slider banner-slider"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="keen-slider__slide"
            >
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
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
            />
            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
            />
          </>
        )}
      </div>
    </>
  );
}

function Arrow(props: { left?: boolean; onClick: (e: any) => void }) {
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? "arrow--left" : "arrow--right"}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
