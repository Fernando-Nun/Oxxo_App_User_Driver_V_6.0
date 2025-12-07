
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import carIconImg from '../assets/Carro_negro_mejorado.png';
import oxxoIconImg from '../assets/Oxxo_icono_mejorado.png';

interface DriverLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route?: { lat: number; lng: number }[];
  isSelected?: boolean;
}

interface AdminMonitorMapProps {
  drivers: DriverLocation[];
  selectedDriverId?: string | null;
  onDriverSelect?: (driverId: string) => void;
  height?: string;
}

export function AdminMonitorMap({ 
  drivers, 
  selectedDriverId,
  onDriverSelect,
  height = '500px' 
}: AdminMonitorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routesRef = useRef<Map<string, L.Polyline>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([19.4326, -99.1332], 12);

    // CartoDB Voyager - estilo claro y moderno para monitoreo
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove());
    routesRef.current.forEach(route => route.remove());
    markersRef.current.clear();
    routesRef.current.clear();

    // Add markers for each driver
    drivers.forEach((driver) => {
      const isSelected = driver.id === selectedDriverId;

      // Calculate car rotation based on route direction
      let carRotation = 0;
      if (driver.route && driver.route.length > 0) {
        const nextPoint = driver.route[0];
        const dx = nextPoint.lng - driver.lng;
        const dy = nextPoint.lat - driver.lat;
        carRotation = Math.atan2(dx, dy) * (180 / Math.PI);
      }

      // Car icon with modern design - reduced size
      const size = isSelected ? 40 : 36;
      const carHeight = isSelected ? 28 : 24;
      const carIcon = L.divIcon({
        html: `<div style="
          width: ${size}px; 
          height: ${carHeight}px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transition: all 0.3s;
        ">
          <img src="${carIconImg}" style="
            width: ${size}px; 
            height: auto; 
            filter: drop-shadow(0 4px 8px ${isSelected ? 'rgba(139,92,246,0.6)' : 'rgba(59,130,246,0.4)'});
            transform: rotate(${carRotation}deg);
            transition: transform 0.3s ease;
          " />
        </div>`,
        className: '',
        iconSize: [size, carHeight],
        iconAnchor: [size / 2, carHeight / 2]
      });

      const marker = L.marker([driver.lat, driver.lng], { icon: carIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<strong>${driver.name}</strong><br/>ID: ${driver.id}`);

      if (onDriverSelect) {
        marker.on('click', () => onDriverSelect(driver.id));
      }

      markersRef.current.set(driver.id, marker);

      // Draw route if driver is selected
      if (isSelected && driver.route && driver.route.length > 0) {
        const routeLatLngs: [number, number][] = [
          [driver.lat, driver.lng],
          ...driver.route.map(loc => [loc.lat, loc.lng] as [number, number])
        ];

        const route = L.polyline(routeLatLngs, {
          color: '#8B5CF6',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 5'
        }).addTo(mapInstanceRef.current!);

        routesRef.current.set(driver.id, route);

        // Add destination marker (red) - reduced size
        const lastPoint = driver.route[driver.route.length - 1];
        const destIcon = L.divIcon({
          html: `<div style="
            width: 36px; 
            height: 36px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
          ">
            <img src="${oxxoIconImg}" style="
              width: 36px; 
              height: auto; 
              filter: drop-shadow(0 4px 8px rgba(239,68,68,0.5));
            " />
          </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        });

        L.marker([lastPoint.lat, lastPoint.lng], { icon: destIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup('Destino OXXO');
      }
    });

    // Fit bounds to show all drivers
    if (drivers.length > 0) {
      const bounds = L.latLngBounds(drivers.map(d => [d.lat, d.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [drivers, selectedDriverId, onDriverSelect]);

  return <div ref={mapRef} style={{ height }} className="rounded-lg border-2 border-blue-400" />;
}
