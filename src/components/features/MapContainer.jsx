import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;

export const MapContainer = ({ children, center = [78.4263369, 10.9563104], zoom = 9 }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = API_KEY;
    
    if (mapRef.current && !mapInstance) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/standard",
        center,
        zoom,
      });

      setMapInstance(map);

      return () => map.remove();
    }
  }, []);

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%" }}>
      {mapInstance && children(mapInstance)}
    </div>
  );
};
