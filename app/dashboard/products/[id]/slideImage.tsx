"use client";
import { useState } from "react";
export default function SlideImage({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="mb-8 lg:mb-0">
      <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-96 object-contain"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`bg-white rounded-md overflow-hidden shadow-sm ${
              currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            <img
              src={image}
              alt={`${name} ${index + 1}`}
              className="w-full h-20 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
