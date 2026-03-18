'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // Demotiles is a basic style available online
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-43.1729, -22.9068], // Coordinates for Rio de Janeiro as default placeholder
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl());

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-md" />;
}
