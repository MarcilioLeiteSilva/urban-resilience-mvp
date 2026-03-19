'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Area } from '@/services/areas';

interface MapContainerProps {
  areas: Area[];
  onAreaClick?: (id: string) => void;
}

export default function MapContainer({ areas, onAreaClick }: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // 1. Inicialização do Mapa no Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-43.1729, -22.9068], // RJ Coordinates
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl());
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // 2. Renderizar os Polígonos das áreas quando houver carga de dados
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const renderLayers = () => {
        const features = areas
          .filter((a) => a.geometry)
          .map((a) => ({
            type: 'Feature' as const,
            properties: { 
                 id: a.id,
                 name: a.name, 
                 risk: a.risk_score ? a.risk_score.toFixed(2) : '0.00' 
            },
            geometry: a.geometry,
          }));

        const geojsonData: any = {
          type: 'FeatureCollection',
          features: features,
        };

        if (map.getSource('areas')) {
          (map.getSource('areas') as maplibregl.GeoJSONSource).setData(geojsonData);
        } else {
          map.addSource('areas', {
            type: 'geojson',
            data: geojsonData,
          });

          map.addLayer({
            id: 'areas-layer-fill',
            type: 'fill',
            source: 'areas',
            paint: {
              'fill-color': '#ef4444', // Vermelho de risco
              'fill-opacity': 0.4,
            },
          });

          map.addLayer({
            id: 'areas-layer-stroke',
            type: 'line',
            source: 'areas',
            paint: {
              'line-color': '#b91c1c',
              'line-width': 2,
            },
          });

          // Clique na área abre Drawer
          map.on('click', 'areas-layer-fill', (e) => {
            if (e.features && e.features[0]) {
              const id = e.features[0].properties.id;
              if (onAreaClick && id) {
                onAreaClick(id);
              }
            }
          });

          // Feedback visual de cursor por cima da área
          map.on('mouseenter', 'areas-layer-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'areas-layer-fill', () => {
            map.getCanvas().style.cursor = '';
          });
        }
    };

    if (map.isStyleLoaded()) {
        renderLayers();
    } else {
        map.on('load', renderLayers);
    }
  }, [areas, onAreaClick]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-md" />;
}
