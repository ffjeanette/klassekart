import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";
import type { Student } from "./FileUpload";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const geocodeAddress = async (address: string) => {
  try {
    const encoded = encodeURIComponent(address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.warn("Geocoding feilet for", address, err);
  }
  return { lat: 59.203, lng: 9.608 };
};

const FitBounds: React.FC<{ locations: Student[]; reference?: Student | null }> = ({
  locations,
  reference,
}) => {
  const map = useMap();

  useEffect(() => {
    const valid = locations.filter((s) => s.lat !== undefined && s.lng !== undefined);
    if (valid.length === 0) return;

    const bounds = new LatLngBounds(valid.map((s) => [s.lat!, s.lng!]));
    map.fitBounds(bounds, { padding: [50, 50] });

    if (reference?.lat !== undefined && reference?.lng !== undefined) {
      map.setView([reference.lat, reference.lng], map.getZoom());
    }
  }, [locations, reference, map]);

  return null;
};

type MapViewProps = {
  students: Student[];
  reference?: Student | null;
};

const MapView: React.FC<MapViewProps> = ({ students, reference }) => {
  return (
    <MapContainer
      center={[reference?.lat ?? 59.203, reference?.lng ?? 9.608]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {students
        .filter((s) => s.lat !== undefined && s.lng !== undefined)
        .map((s, idx) => (
          <Marker key={idx} position={[s.lat!, s.lng!]} icon={defaultIcon}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}

      <FitBounds locations={students} reference={reference} />
    </MapContainer>
  );
};

export default MapView;
