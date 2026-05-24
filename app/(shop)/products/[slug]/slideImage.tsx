"use client";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

export default function SlideImage({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div>
      <div className="shop-card relative aspect-square overflow-hidden bg-shop-surface-muted">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          fill
          className="object-contain p-8 md:p-12"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={clsx(
                "aspect-square overflow-hidden rounded-shop border bg-shop-surface-muted transition-all duration-shop ease-shop",
                currentImageIndex === index
                  ? "border-shop-text ring-1 ring-shop-text"
                  : "border-shop-border-subtle hover:border-shop-border",
              )}
            >
              <div className="relative h-full w-full">
                <Image
                  src={image}
                  alt={`${name} ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
