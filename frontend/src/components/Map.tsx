'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

// Substituição do ícone padrão do Leaflet, pois os assets originais não são resolvidos corretamente durante a compilação do Next.js.
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface RequestData {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: 'CRITICAL' | 'URGENT' | 'MODERATE';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  type: string;
}

interface MapProps {
  requests: RequestData[];
  onMarkerClick?: (request: RequestData) => void;
}

const getMarkerColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return 'hue-rotate-[150deg]';
    case 'URGENT': return 'hue-rotate-[220deg]';
    default: return 'hue-rotate-[290deg]';
  }
};

export default function InteractiveMap({ requests, onMarkerClick }: MapProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full rounded-2xl glass animate-pulse" />;
  }

  // Coordenadas iniciais definidas estaticamente para a região de Porto Alegre como predefinição (fallback) para a MVP.
  const defaultCenter: [number, number] = [-30.0346, -51.2177];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[500px] w-full rounded-2xl overflow-hidden glass-panel relative z-0"
    >
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {requests.map((req) => (
          <Marker 
            key={req.id} 
            position={[req.latitude, req.longitude]}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(req),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{req.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                <div className="flex gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    req.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    req.priority === 'URGENT' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t.map.priorities[req.priority] || req.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-800">
                    {t.map.types[req.type as keyof typeof t.map.types] || req.type}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
