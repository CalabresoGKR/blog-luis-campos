"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useLightbox } from "@/components/public/Lightbox";
import { FadeIn } from "@/components/public/FadeIn";

interface GalleryImage {
  url: string;
  alt: string | null;
}

interface ArtworkGalleryProps {
  images: GalleryImage[];
}

export function ArtworkGallery({ images }: ArtworkGalleryProps) {
  const { open, lightbox } = useLightbox(images);

  if (images.length === 0) return null;

  const [main, ...thumbs] = images;

  return (
    <>
      {lightbox}

      {/* Main image */}
      <FadeIn>
        <div
          className="relative aspect-[4/3] overflow-hidden bg-canvas cursor-zoom-in group"
          onClick={() => open(0)}
        >
          <Image
            src={main.url}
            alt={main.alt ?? ""}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300 flex items-end justify-end p-4">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-paper/90 rounded-full p-2">
              <ZoomIn size={18} className="text-ink" />
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Thumbnails */}
      {thumbs.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {thumbs.slice(0, 4).map((img, i) => (
            <FadeIn key={i} delay={i * 50}>
              <div
                className="relative aspect-square overflow-hidden bg-canvas cursor-pointer"
                onClick={() => open(i + 1)}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? ""}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="15vw"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
