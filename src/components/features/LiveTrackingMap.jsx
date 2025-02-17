import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { busStopService, scheduledBusService } from "../../services";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;
const BUS_STOP_ICON = "/bus-stop.png";
const BUS_ICON = "/bus.png";
const DEFAULT_CENTER = [78.4445, 10.9536];

export const LiveTrackingMap = ({ zoom = 15, selectedBusStop }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [onRouteBuses, setOnRouteBuses] = useState([]);
  const busMarkers = useRef(new Map());

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

  // Fetch On Route Buses and update markers every 10s
  useEffect(() => {
    const fetchOnRouteBuses = async () => {
      try {
        const response = await scheduledBusService.getAllScheduledBuses({
          status: ["On Route"],
        });
        setOnRouteBuses(response);
        updateBusMarkers(response);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchOnRouteBuses();
    const interval = setInterval(fetchOnRouteBuses, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [mapInstance]);

  // Initialize Map
  useEffect(() => {
    if (!selectedBusStop) {
      console.log("No bus stop selected. Using default location.");
    }

    mapboxgl.accessToken = API_KEY;

    // Center on selected bus stop if available, else center on user's location or default location
    const initialCenter = localStorage?.getItem('selectedBusStop')
      ? JSON.parse(localStorage.getItem('selectedBusStop')).coordinates
      : selectedBusStop?.coordinates || DEFAULT_CENTER;

    // Only initialize map when `selectedBusStop` is available or fallback to default location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initializeMap([longitude, latitude], initialCenter);
      },
      () => {
        console.error("Location access denied. Defaulting to Tamil Nadu.");
        initializeMap(DEFAULT_CENTER, initialCenter);
      },
      { enableHighAccuracy: true }
    );
  }, [selectedBusStop]); // Run this every time `selectedBusStop` changes

  // Initialize map and add bus stops
  const initializeMap = (userCenter, stopCenter) => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: stopCenter || userCenter,
      zoom,
    });

    setMapInstance(map);

    // Add Bus Stops Markers
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

      // Set up bus markers if any buses are on route
      onRouteBuses.forEach((bus) => {
        const { latitude, longitude } = bus.location;
        if (!latitude || !longitude) {
          console.warn(`Invalid location for bus ${bus.bus.busNumber}`);
          return;
        }

        const el = document.createElement("div");
        el.className = "bus-marker";
        el.style.backgroundImage = `url(${BUS_ICON})`;
        el.style.width = "50px";
        el.style.height = "30px";
        el.style.backgroundSize = "cover";

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText(`Bus ${bus.bus.busNumber}`))
          .addTo(map);

        // Store the marker in a map with the bus ID as the key
        busMarkers.current.set(bus._id, marker);
      });
    });
  };

  const prevLocations = useRef(new Map()); 

  const calculateBearing = (prev, curr) => {
    const { latitude: lat1, longitude: lon1 } = prev;
    const { latitude: lat2, longitude: lon2 } = curr;
  
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;
  
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δλ = toRadians(lon2 - lon1);
  
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
    let θ = Math.atan2(y, x);
    θ = toDegrees(θ);
    return (θ + 360) % 360; // Normalize to 0-360 degrees
  };
  
  const updateBusMarkers = (buses) => {
    if (!mapInstance || !busMarkers.current) return;
  
    buses.forEach((bus) => {
      const { latitude, longitude } = bus.location;
      const busNumber = bus.bus.busNumber;
  
      if (!latitude || !longitude) {
        console.warn(`Bus ${busNumber} has an invalid location:`, bus.location);
        return;
      }
  
      const prevLocation = prevLocations.current.get(bus._id);
      prevLocations.current.set(bus._id, { latitude, longitude });
  
      let bearing = 0; // Default if no previous location
      if (prevLocation) {
        bearing = calculateBearing(prevLocation, { latitude, longitude });
      }
  
      const existingMarker = busMarkers.current.get(bus._id);
      if (existingMarker) {
        existingMarker.setLngLat([longitude, latitude]);
  
        // Apply rotation using transform
        existingMarker.getElement().style.transform = `rotate(${bearing}deg)`;
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
          .setPopup(new mapboxgl.Popup().setText(`Bus ${busNumber}`))
          .addTo(mapInstance);
  
        busMarkers.current.set(bus._id, marker);
      }
    });
  };
  

  return <div ref={mapRef} className="w-full h-screen" />;
};
