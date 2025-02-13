import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const BusStopManager = ({ mapInstance, onBusStopAdded, busStop }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapInstance) return;

    // If busStop has predefined coordinates, place a marker
    if (busStop?.coordinates?.lng && busStop?.coordinates?.lat) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([busStop.coordinates.lng, busStop.coordinates.lat])
        .addTo(mapInstance);
    }

    const addBusStopMarker = (e) => {
      const { lng, lat } = e.lngLat;
      
      // Remove the previous marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      // Add a new marker
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapInstance);
      
      if (onBusStopAdded) {
        onBusStopAdded({ lng, lat });
      }
    };

    mapInstance.on("click", addBusStopMarker);
    
    return () => {
      mapInstance.off("click", addBusStopMarker);
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [mapInstance, onBusStopAdded, busStop]);

  return null;
};