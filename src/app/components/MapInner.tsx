'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import EventDetailsPopover from './EventDetailsPopover';

// ✅ Fix missing icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapInner({ events }: any) {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // ✅ Ask for user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("⚠️ User location not available:", err.message)
      );
    } else {
      console.warn("❌ Geolocation not supported by this browser.");
    }
  }, []);

  const defaultCenter: LatLngExpression = [12.9716, 77.5946];

  const handleOpenPopover = (event: any, e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSelectedEvent(event);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  return (
    <>
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={20}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🧭 Center map to user location */}
        {userLocation && mapReady && <SetMapCenter position={userLocation} />}

        {/* 🔴 User Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
              iconSize: [35, 35],
              iconAnchor: [17, 35],
            })}
          >
            <Popup>You are here 📍</Popup>
          </Marker>
        )}

        {/* 🗺️ Event markers */}
        {events?.map((event: any) => (
          <Marker
            key={event._id}
            position={[event.latitude, event.longitude] as LatLngExpression}
          >
            <Popup>
              <strong
                style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={(e) => handleOpenPopover(event, e)}
              >
                {event.eventName}
              </strong>
              <br />
              📍 {event.location}
              <br />
              {/* 💰 ₹{event.ticketPrice} */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ✅ Popover Component */}
      <EventDetailsPopover
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
        event={selectedEvent}
      />
    </>
  );
}

function SetMapCenter({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 14);
  }, [map, position]);
  return null;
}
