"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./lightbox";

interface PostImageGalleryProps {
  images: string[];
  alt: string;
}

export function PostImageGallery({ images, alt }: PostImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid gap-6">
        {images.map((url, index) => (
          <div
            key={index}
            onClick={() => {
              setStartIndex(index);
              setIsOpen(true);
            }}
            className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 cursor-zoom-in group transition-all hover:ring-2 hover:ring-primary/20"
          >
            <div className="relative aspect-video">
              <Image
                src={url}
                alt={`${alt} - ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        ))}
      </div>
      <Lightbox
        images={images}
        startIndex={startIndex}
        open={isOpen}
        onOpenChange={setIsOpen}
        alt={alt}
      />
    </>
  );
}
