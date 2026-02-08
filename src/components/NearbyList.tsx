import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import type { Student } from "./FileUpload";

type NearbyListProps = {
  students: Student[];
  reference?: Student | { lat: number; lng: number } | null;
};

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const NearbyList: React.FC<NearbyListProps> = ({ students, reference }) => {
  const refLat = reference?.lat ?? 59.203;
  const refLng = reference?.lng ?? 9.608;

  const filtered = students.filter((s) => s !== reference);

  const sorted = [...filtered].sort((a, b) => {
    const aLat = a.lat ?? refLat;
    const aLng = a.lng ?? refLng;
    const bLat = b.lat ?? refLat;
    const bLng = b.lng ?? refLng;
    return getDistance(aLat, aLng, refLat, refLng) - getDistance(bLat, bLng, refLat, refLng);
  });

  if (!students.length) return <p>Ingen studenter funnet. Last opp en fil for å se nærmeste.</p>;

  return (
    <List>
      {sorted.map((s, idx) => {
        const lat = s.lat ?? refLat;
        const lng = s.lng ?? refLng;
        const distance = getDistance(lat, lng, refLat, refLng);
        const distanceStr = distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;

        return (
          <ListItem key={idx}>
            <ListItemText primary={s.name} secondary={`${s.address} • ${distanceStr}`} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default NearbyList;
