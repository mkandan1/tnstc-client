import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { busStopService, scheduledBusService } from "../../services";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;
const BUS_STOP_ICON = "/bus-stop.png";
const BUS_ICON = "/bus.png";
const DEFAULT_CENTER = [78.4445, 10.9536];

export const LiveTrackingMap = ({ zoom = 10, selectedBusStop }) => {
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
          el.style.width = "10px";
          el.style.height = "10px";
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

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    
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
    if (!mapInstance.current || !mapRef.current) {
      console.warn("Map instance is not available. Skipping marker updates.");
      return;
    }
  
    buses.forEach((bus) => {
      if (!bus.location?.latitude || !bus.location?.longitude) {
        console.warn(`Invalid bus location: ${bus.bus?.busNumber}`);
        return;
      }
  
      const { latitude, longitude } = bus.location;
      const busId = bus._id;
  
      // Check if marker already exists
      let marker = busMarkers.current.get(busId);
      if (marker) {
        marker.setLngLat([longitude, latitude]);
      } else {
        const el = document.createElement("div");
        el.className = "bus-marker";
        el.style.backgroundImage = `url(${BUS_ICON})`;
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.backgroundSize = "cover";
  
        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText(`Bus ${bus.bus?.busNumber}`))
          .addTo(mapInstance.current);
  
        busMarkers.current.set(busId, marker);
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
