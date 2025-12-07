
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import carIcon from '../assets/Carro_negro_mejorado.png';
import oxxoIcon from '../assets/Oxxo_icono_mejorado.png';
import locationIcon from '../assets/Ubicacion_rojo_mejorado.png';

interface Location {
  lat: number;
  lng: number;
  label?: string;
}

interface DriverMapViewProps {
  currentLocation: Location;
  pickupLocation?: Location;
  destination: Location;
  passengersLocations?: Location[];
  height?: string;
  showNavigation?: boolean;
}

// Calculate rotation angle based on route direction
const calculateRotation = (currentLat: number, currentLng: number, targetLat: number, targetLng: number): number => {
  const dx = targetLng - currentLng;
  const dy = targetLat - currentLat;
  const angle = Math.atan2(dx, dy) * (180 / Math.PI);
  return angle;
};

export function DriverMapView({ 
  currentLocation,
  pickupLocation,
  destination,
  passengersLocations = [],
  height = '400px',
  showNavigation = true
}: DriverMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Calculate car rotation - point towards pickup if exists, otherwise destination
    const targetPoint = pickupLocation || destination;
    const carRotation = calculateRotation(
      currentLocation.lat, 
      currentLocation.lng, 
      targetPoint.lat, 
      targetPoint.lng
    );

    // Car icon - reduced size (36x24)
    const iconWidth = 36;
    const iconHeight = 24;
    const carMarkerIcon = L.divIcon({
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
          transform: rotate(${carRotation}deg);
          transition: transform 0.3s ease;
        " />
      </div>`,
      className: '',
      iconSize: [iconWidth, iconHeight],
      iconAnchor: [iconWidth / 2, iconHeight / 2]
    });

    const carMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: carMarkerIcon })
      .addTo(map)
      .bindPopup('Tu ubicación');

    // Pickup location - use red location icon
    if (pickupLocation) {
      const pickupIconWidth = 32;
      const pickupIconHeight = 40;

      const pickupMarkerIcon = L.divIcon({
        html: `<div style="
          width: ${pickupIconWidth}px;
          height: ${pickupIconHeight}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${locationIcon}" style="
            width: ${pickupIconWidth}px;
            height: auto;
            filter: drop-shadow(0 4px 8px rgba(239,68,68,0.4));
          " />
        </div>`,
        className: '',
        iconSize: [pickupIconWidth, pickupIconHeight],
        iconAnchor: [pickupIconWidth / 2, pickupIconHeight]
      });

      L.marker([pickupLocation.lat, pickupLocation.lng], { icon: pickupMarkerIcon })
        .addTo(map)
        .bindPopup('Punto de recogida');

      // Route to pickup (blue dashed)
      if (showNavigation) {
        L.polyline([
          [currentLocation.lat, currentLocation.lng],
          [pickupLocation.lat, pickupLocation.lng]
        ], { color: '#3B82F6', weight: 4, opacity: 0.7, dashArray: '10, 5' }).addTo(map);
      }
    }

    // Destination (OXXO) icon - reduced size (36x36)
    const destMarkerIcon = L.divIcon({
      html: `<div style="
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img src="${oxxoIcon}" style="
          width: 36px;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(239,68,68,0.4));
        " />
      </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    L.marker([destination.lat, destination.lng], { icon: destMarkerIcon })
      .addTo(map)
      .bindPopup('OXXO - Destino');

    // Route to destination (solid red)
    if (showNavigation && !pickupLocation) {
      L.polyline([
        [currentLocation.lat, currentLocation.lng],
        [destination.lat, destination.lng]
      ], { color: '#EF4444', weight: 4, opacity: 0.7 }).addTo(map);
    }

    // Fit bounds to show all markers
    const bounds = L.latLngBounds([
      [currentLocation.lat, currentLocation.lng],
      [destination.lat, destination.lng],
      ...(pickupLocation ? [[pickupLocation.lat, pickupLocation.lng] as [number, number]] : [])
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentLocation, pickupLocation, destination, showNavigation]);

  return <div ref={mapRef} style={{ height }} className="rounded-lg border-2 border-blue-400" />;
}
