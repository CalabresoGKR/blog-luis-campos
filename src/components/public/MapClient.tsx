"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  city?: string | null;
  country?: string | null;
  description?: string | null;
  artwork?: {
    title: string;
    slug: string;
    year?: number | null;
  } | null;
  image?: { url: string; alt?: string | null } | null;
}

interface MapClientProps {
  pins: Pin[];
}

export function MapClient({ pins }: MapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstance.current) return;

      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [39.5, -8.0],
        zoom: 6,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapInstance.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18,
      }).addTo(map);

      // Custom marker icon
      const customIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:#9a3b2e;border:2px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -12],
      });

      pins.forEach((pin) => {
        const popupContent = document.createElement("div");
        popupContent.style.cssText = "min-width:200px;max-width:280px;font-family:var(--font-sans,sans-serif)";
        popupContent.innerHTML = `
          ${pin.image ? `<div style="position:relative;height:140px;overflow:hidden;"><img src="${pin.image.url}" alt="${pin.image.alt ?? ""}" style="width:100%;height:100%;object-fit:cover;" /></div>` : ""}
          <div style="padding:12px 14px;">
            ${pin.artwork ? `<p style="font-size:16px;font-weight:600;color:#1a1a1a;margin:0 0 4px;line-height:1.3;">${pin.artwork.title}</p>` : ""}
            ${pin.artwork?.year ? `<p style="font-size:12px;color:#6b6b6b;margin:0 0 6px;">${pin.artwork.year}</p>` : ""}
            ${pin.city || pin.country ? `<p style="font-size:12px;color:#6b6b6b;margin:0 0 8px;">${[pin.city, pin.country].filter(Boolean).join(", ")}</p>` : ""}
            ${pin.description ? `<p style="font-size:12px;color:#6b6b6b;margin:0 0 10px;line-height:1.4;">${pin.description}</p>` : ""}
            ${pin.artwork ? `<a href="/obras/${pin.artwork.slug}" style="display:inline-block;font-size:12px;color:#9a3b2e;font-weight:500;text-decoration:none;">Ver obra →</a>` : ""}
          </div>
        `;

        L.marker([pin.latitude, pin.longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(L.popup({ closeButton: false, maxWidth: 280, minWidth: 200 }).setContent(popupContent));
      });

      if (pins.length > 0) {
        const group = L.featureGroup(
          pins.map((p) => L.marker([p.latitude, p.longitude]))
        );
        map.fitBounds(group.getBounds().pad(0.2), { maxZoom: 8 });
      }
    });

    return () => {
      if (mapInstance.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstance.current as any).remove();
        mapInstance.current = null;
      }
    };
  }, [pins]);

  // Leaflet CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
}
