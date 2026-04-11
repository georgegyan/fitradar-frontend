import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map view when center changes
function ChangeView({ center, zoom }) {
  const map = useMap();

  useEffect (() => {
    if (center) {
        map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapView({ gyms, center, zoom = 13 }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '500px', width: '100%' }}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {gyms.map((gym) => (
        <Marker
          key={gym.id}
          position={[gym.latitude, gym.longitude]}
        >
          <Popup>
            <strong>{gym.name}</strong><br />
            {gym.address}<br />
            {gym.price_per_session && `$${gym.price_per_session}/session`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}