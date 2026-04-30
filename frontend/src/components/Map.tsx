'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import Supercluster, { PointFeature } from 'supercluster';
import { AlertTriangle } from 'lucide-react';
import { createRoot } from 'react-dom/client';

// Fix default icon
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

// Cluster component inside MapContainer
function ClusteredMarkers({ requests, onMarkerClick, t }: { requests: RequestData[], onMarkerClick?: (r: RequestData) => void, t: any }) {
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState(12);

  const map = useMapEvents({
    moveend: () => updateBounds(),
    zoomend: () => updateBounds()
  });

  const updateBounds = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getWest(),
      b.getSouth(),
      b.getEast(),
      b.getNorth()
    ]);
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const index = useMemo(() => {
    const supercluster = new Supercluster({
      radius: 40,
      maxZoom: 16
    });

    const points = requests.map((req) => ({
      type: 'Feature' as const,
      properties: { cluster: false, requestData: req, ...req },
      geometry: {
        type: 'Point' as const,
        coordinates: [req.longitude, req.latitude] as [number, number]
      }
    }));

    supercluster.load(points);
    return supercluster;
  }, [requests]);

  const clusters = useMemo(() => {
    if (!bounds) return [];
    return index.getClusters(bounds, zoom);
  }, [bounds, zoom, index]);

  const createClusterIcon = (count: number) => {
    const size = count < 10 ? 30 : count < 100 ? 40 : 50;
    return L.divIcon({
      html: `<div style="background-color: rgba(239, 68, 68, 0.9); backdrop-filter: blur(4px); color: white; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: bold; font-size: ${count < 10 ? 14 : 16}px;">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={createClusterIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = index.getClusterExpansionZoom(cluster.id as number);
                  map.setView([latitude, longitude], expansionZoom, { animate: true });
                }
              }}
            />
          );
        }

        const req = cluster.properties.requestData as RequestData;
        
        // Community Warning distinct icon
        let icon = DefaultIcon;
        if (req.type === 'COMMUNITY_WARNING') {
          icon = L.divIcon({
            html: `<div style="background-color: #f59e0b; color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg></div>`,
            className: 'community-warning-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
        }

        return (
          <Marker 
            key={`req-${req.id}`} 
            position={[latitude, longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(req),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                {req.type === 'COMMUNITY_WARNING' && (
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-1 uppercase tracking-wider">
                    <AlertTriangle size={12} /> Aviso da Comunidade
                  </div>
                )}
                <h3 className="font-bold text-lg">{req.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
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
        );
      })}
    </>
  );
}

export default function InteractiveMap({ requests, onMarkerClick }: MapProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch official risk zones
    fetch('/official-risk-zones.geojson')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Could not load risk zones:", err));
  }, []);

  if (!mounted) {
    return <div className="h-[400px] w-full rounded-2xl glass animate-pulse flex items-center justify-center text-slate-500">Carregando mapa...</div>;
  }

  const defaultCenter: [number, number] = [-30.0346, -51.2177];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[500px] w-full rounded-2xl overflow-hidden glass-panel relative z-0 shadow-2xl border border-white/20"
    >
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true} // Enabled for better UX
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Cleaner base map for data visualization
        />
        
        {/* Official Risk Zones Overlay */}
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            style={(feature) => ({
              color: '#ef4444',
              weight: 2,
              opacity: 0.8,
              fillColor: feature?.properties?.riskLevel === 'HIGH' ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.2,
              dashArray: '5, 5'
            })}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`<strong>Área de Risco Oficial</strong><br/>${feature.properties.name}`);
              }
            }}
          />
        )}

        <ClusteredMarkers requests={requests} onMarkerClick={onMarkerClick} t={t} />
      </MapContainer>
    </motion.div>
  );
}
