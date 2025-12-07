
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import carIcon from '../assets/Carro_negro_mejorado.png';
import oxxoIcon from '../assets/Oxxo_icono_mejorado.png';
import locationIcon from '../assets/Ubicacion_rojo_mejorado.png';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
  label?: string;
}

interface MapViewProps {
  center?: Location;
  zoom?: number;
  markers?: Location[];
  route?: Location[];
  height?: string;
  className?: string;
  onMapReady?: (map: L.Map) => void;
}

export function MapView({ 
  center = { lat: 19.4326, lng: -99.1332 }, // CDMX default
  zoom = 13,
  markers = [],
  route = [],
  height = '400px',
  className = '',
  onMapReady
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

    // CartoDB Voyager - estilo moderno y gratuito
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Calculate rotation angle based on route direction
  const calculateRotation = (currentLat: number, currentLng: number, targetLat: number, targetLng: number): number => {
    const dx = targetLng - currentLng;
    const dy = targetLat - currentLat;
    // Convert to degrees, adjust so 0 degrees points right (east)
    // and rotate counterclockwise. The car image faces up by default.
    const angle = Math.atan2(dx, dy) * (180 / Math.PI);
    return angle;
  };

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersLayerRef.current.forEach(marker => marker.remove());
    markersLayerRef.current = [];

    // Add new markers with custom images
    markers.forEach((location, index) => {
      const label = location.label?.toLowerCase() || '';

      // Detect marker type based on label
      const isDestination = label.includes('destino') || 
                           label.includes('oxxo') ||
                           label.includes('tienda');

      const isUserLocation = label.includes('tu ubicación') || 
                            label.includes('origen') ||
                            label.includes('recogida') ||
                            label.includes('pickup');

      const isCar = label.includes('conductor') || 
                   label.includes('camino') ||
                   label.includes('carro') ||
                   label.includes('auto') ||
                   label.includes('vehículo');

      let customIcon: L.DivIcon;

      if (isDestination) {
        // OXXO destination icon
        const iconWidth = 36;
        const iconHeight = 36;
        customIcon = L.divIcon({
          html: `<div style="
            width: ${iconWidth}px;
            height: ${iconHeight}px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${oxxoIcon}" style="
              width: ${iconWidth}px;
              height: auto;
              filter: drop-shadow(0 4px 8px rgba(239,68,68,0.4));
            " />
          </div>`,
          className: '',
          iconSize: [iconWidth, iconHeight],
          iconAnchor: [iconWidth / 2, iconHeight]
        });
      } else if (isUserLocation) {
        // Red location icon for user location / pickup points
        const iconWidth = 32;
        const iconHeight = 40;
        customIcon = L.divIcon({
          html: `<div style="
            width: ${iconWidth}px;
            height: ${iconHeight}px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${locationIcon}" style="
              width: ${iconWidth}px;
              height: auto;
              filter: drop-shadow(0 4px 8px rgba(239,68,68,0.4));
            " />
          </div>`,
          className: '',
          iconSize: [iconWidth, iconHeight],
          iconAnchor: [iconWidth / 2, iconHeight]
        });
      } else {
        // Car icon for conductor/driver markers
        const iconWidth = 36;
        const iconHeight = 24;

        // Calculate rotation based on route
        let rotation = 0;
        if (route.length > 1) {
          // Find target point for rotation
          const currentIndex = route.findIndex(r => 
            Math.abs(r.lat - location.lat) < 0.001 && 
            Math.abs(r.lng - location.lng) < 0.001
          );

          if (currentIndex >= 0 && currentIndex < route.length - 1) {
            // Point towards next waypoint
            const next = route[currentIndex + 1];
            rotation = calculateRotation(location.lat, location.lng, next.lat, next.lng);
          } else if (route.length >= 2) {
            // Default: point towards destination (last point in route)
            const destination = route[route.length - 1];
            rotation = calculateRotation(location.lat, location.lng, destination.lat, destination.lng);
          }
        }

        customIcon = L.divIcon({
          html: `<div style="
            width: ${iconWidth}px;
            height: ${iconHeight}px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${carIcon}" style="
              width: ${iconWidth}px;
              height: auto;
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
              transform: rotate(${rotation}deg);
              transition: transform 0.3s ease;
            " />
          </div>`,
          className: '',
          iconSize: [iconWidth, iconHeight],
          iconAnchor: [iconWidth / 2, iconHeight / 2]
        });
      }

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!);
      if (location.label) {
        marker.bindPopup(location.label);
      }
      markersLayerRef.current.push(marker);
    });
  }, [markers, route]);

  // Update route
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    // Add new route
    if (route.length > 1) {
      const latlngs: [number, number][] = route.map(loc => [loc.lat, loc.lng]);
      routeLayerRef.current = L.polyline(latlngs, { 
        color: '#EF4444', 
        weight: 4,
        opacity: 0.7 
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show entire route
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [route]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }} 
      className={`rounded-lg ${className}`}
    />
  );
}
