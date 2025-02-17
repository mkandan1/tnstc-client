import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { busStopService, scheduledBusService } from "../../services";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;
const BUS_STOP_ICON = "/bus-stop.png";
const BUS_ICON = "/bus.png";
const DEFAULT_CENTER = [78.4445, 10.9536];

export const LiveTrackingMap = ({ zoom = 15, selectedBusStop }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const busMarkers = useRef(new Map());
  const prevLocations = useRef(new Map());

  const [busStops, setBusStops] = useState([]);

  // Fetch bus stops
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await busStopService.getAllBusStops();
        setBusStops(response.busStops);
      } catch (error) {
        console.error("Error fetching bus stops:", error);
      }
    };
    fetchBusStops();
  }, []);

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken = API_KEY;

    // Determine initial center
    const initialCenter = selectedBusStop?.coordinates || DEFAULT_CENTER;

    // Initialize map
    const initializeMap = (center) => {
      if (mapInstance.current) return; // Prevent multiple instances

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center,
        zoom,
      });

      mapInstance.current = map;

      map.on("load", () => {
        busStops.forEach((stop) => {
          const el = document.createElement("div");
          el.className = "bus-stop-marker";
          el.style.backgroundImage = `url(${BUS_STOP_ICON})`;
          el.style.width = "30px";
          el.style.height = "30px";
          el.style.backgroundSize = "cover";

          new mapboxgl.Marker({ element: el })
            .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
            .setPopup(new mapboxgl.Popup().setText(stop.name))
            .addTo(map);
        });
      });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        initializeMap([position.coords.longitude, position.coords.latitude]);
      },
      () => {
        console.error("Location access denied. Defaulting to Tamil Nadu.");
        initializeMap(initialCenter);
      },
      { enableHighAccuracy: true }
    );

    return () => mapInstance.current?.remove();
  }, [selectedBusStop, busStops]);

  // Calculate direction bearing
  const calculateBearing = (prev, curr) => {
    if (!prev) return 0;

    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;

    const φ1 = toRadians(prev.latitude);
    const φ2 = toRadians(curr.latitude);
    const Δλ = toRadians(curr.longitude - prev.longitude);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    return (toDegrees(Math.atan2(y, x)) + 360) % 360;
  };

  // Update bus markers
  const updateBusMarkers = (buses) => {
    if (!mapInstance.current) return;

    buses.forEach((bus) => {
      const { latitude, longitude } = bus.location;
      if (!latitude || !longitude) return;

      const prevLocation = prevLocations.current.get(bus._id);
      prevLocations.current.set(bus._id, { latitude, longitude });

      const bearing = prevLocation ? calculateBearing(prevLocation, { latitude, longitude }) : 0;

      if (busMarkers.current.has(bus._id)) {
        const marker = busMarkers.current.get(bus._id);
        marker.setLngLat([longitude, latitude]);
        marker.getElement().style.transform = `rotate(${bearing}deg)`;
      } else {
        const el = document.createElement("div");
        el.className = "bus-marker";
        el.style.backgroundImage = `url(${BUS_ICON})`;
        el.style.width = "50px";
        el.style.height = "30px";
        el.style.backgroundSize = "cover";
        el.style.transform = `rotate(${bearing}deg)`;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText(`Bus ${bus.bus.busNumber}`))
          .addTo(mapInstance.current);

        busMarkers.current.set(bus._id, marker);
      }
    });
  };

  // Fetch buses every 10s
  useEffect(() => {
    const fetchOnRouteBuses = async () => {
      try {
        const response = await scheduledBusService.getAllScheduledBuses({
          status: ["On Route"],
        });
        updateBusMarkers(response);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchOnRouteBuses();
    const interval = setInterval(fetchOnRouteBuses, 10000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={mapRef} className="w-full h-screen" />;
};
