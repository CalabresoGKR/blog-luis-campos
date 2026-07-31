"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxImage {
  url: string;
  alt?: string | null;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-paper/60 hover:text-paper p-2 transition-colors z-10"
        onClick={onClose}
        aria-label="Fechar"
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/60 hover:text-paper p-3 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Anterior"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-paper/60 hover:text-paper p-3 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Próxima"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div
        className="relative w-full max-w-5xl max-h-[85vh] px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current].url}
          alt={images[current].alt ?? ""}
          width={1400}
          height={900}
          className="object-contain w-full h-full max-h-[80vh]"
          priority
        />
        {images.length > 1 && (
          <p className="text-center text-paper/40 text-sm mt-4">
            {current + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}

// Hook to use lightbox
export function useLightbox(images: LightboxImage[]) {
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => setIndex(i);
  const close = () => setIndex(null);

  const lightbox =
    index !== null ? (
      <Lightbox images={images} initialIndex={index} onClose={close} />
    ) : null;

  return { open, lightbox };
}
