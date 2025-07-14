// components/ui/rating-stars.tsx
"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Asegúrate de que esta utilidad esté disponible o cámbiala por una simple concatenación de clases

interface RatingStarsProps {
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
  className?: string;
  starClassName?: string;
}

export function RatingStars({
  value,
  onChange,
  maxValue = 5,
  className,
  starClassName,
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number) => {
    onChange(index + 1);
  };

  const handleMouseEnter = (index: number) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxValue }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "cursor-pointer transition-colors duration-200",
            (hoverValue !== null ? hoverValue : value) > index
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-400",
            starClassName
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
