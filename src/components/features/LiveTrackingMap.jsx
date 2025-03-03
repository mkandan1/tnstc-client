import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { busStopService, scheduledBusService } from "../../services";
import wsService from "../../services/webSocketService";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;
const BUS_STOP_ICON = "/bus-stop.png";
const BUS_ICON = "/bus.png";
const DING_SOUND = "/ding.mpeg"; // Add this sound file in your public folder
const DEFAULT_CENTER = [78.4445, 10.9536];

export const LiveTrackingMap = ({ zoom = 10, selectedBusStop }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const busMarkers = useRef(new Map());


  const [busStops, setBusStops] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  useEffect(() => {
    const enableAudio = () => setIsUserInteracted(true);

    window.addEventListener("click", enableAudio);
    window.addEventListener("keydown", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
    };
  }, []);


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
    const initialCenter = selectedBusStop?.coordinates || DEFAULT_CENTER;

    const initializeMap = (center) => {
      if (mapInstance.current) return;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11",
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

  const findNearestBusStop = (stops, busLocation) => {
    let nearest = null;
    let minDistance = Infinity;

    stops.forEach((stop) => {
      const distance = Math.sqrt(
        Math.pow(stop.coordinates.lat - busLocation.lat, 2) +
        Math.pow(stop.coordinates.lng - busLocation.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = stop;
      }
    });

    return nearest;
  };

  const updateBusMarkers = (buses) => {
    if (!mapInstance.current || !mapRef.current) return;
  
    buses.forEach((bus) => {
      if (!bus.location?.latitude || !bus.location?.longitude) return;
  
      const { latitude, longitude } = bus.location;
      const busId = bus._id;
  
      let marker = busMarkers.current.get(busId);
  
      if (marker) {
        // Get current marker position
        const currentLngLat = marker.getLngLat();
        const start = { lng: currentLngLat.lng, lat: currentLngLat.lat };
        const end = { lng: longitude, lat: latitude };
        const duration = 2000; // 2 seconds animation
        let startTime;
  
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1); // Normalize progress
  
          const interpolatedLng = start.lng + (end.lng - start.lng) * progress;
          const interpolatedLat = start.lat + (end.lat - start.lat) * progress;
  
          marker.setLngLat([interpolatedLng, interpolatedLat]);
  
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
  
        requestAnimationFrame(animate);
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
  
  // Play "ding-ding" sound
  const playDingSound = () => {


    const dingAudio = new Audio(DING_SOUND);
    dingAudio.play().catch((err) => console.error("Audio play error:", err));
  };


  // Speak the announcement
  const speakAnnouncement = (message) => {
    if (responsiveVoice.voiceSupport()) {
      responsiveVoice.speak(message, "Tamil Female");
    } else {
      console.warn("ResponsiveVoice is not loaded");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "காலை வணக்கம்!";
    if (hour < 18) return "மதிய வணக்கம்!";
    return "மாலை வணக்கம்!";
  };



  const makePeriodicAnnouncements = (buses) => {
    if (!buses.length) return;

    let announcementMessage = `${getGreeting()} பயணிகளின் கனிவான கவனத்திற்கு! `;

    buses.forEach((bus) => {
      const nearestStop = findNearestBusStop(busStops, {
        lat: bus.location.latitude,
        lng: bus.location.longitude,
      });

      console.log(nearestStop)

      announcementMessage += `பஸ் ${bus.bus?.busNumber}, ${bus.route.routeName.split(" to ")[0]} இலிருந்து ${bus.route.routeName.split(" to ")[1]} நோக்கி பயணித்து வருகிறது. தற்போது, இது ${nearestStop?.name} அருகில் உள்ளது. `;

    });

    setAnnouncement(announcementMessage);
    console.log("Announcing: ", announcementMessage);

    playDingSound();
    setTimeout(() => {
      speakAnnouncement(announcementMessage);
    }, 2000); // 2s delay after ding sound
  };

  useEffect(() => {
    if (!selectedBusStop?._id) return;

    // Function to handle WebSocket messages
    const handleWebSocketMessage = (data) => {
        if (data.type === "busStopResponse") {
            updateBusMarkers(data.buses);
        }
    };

    wsService.addMessageHandler(handleWebSocketMessage);
    wsService.requestScheduledBuses(selectedBusStop._id);

    return () => {
        // Cleanup WebSocket listener when component unmounts
        wsService.messageHandlers = wsService.messageHandlers.filter(handler => handler !== handleWebSocketMessage);
    };
}, [selectedBusStop]);




  // Make announcement every 5 mins
  useEffect(() => {
    const fetchAndAnnounce = async () => {
      try {
        const response = await scheduledBusService.getAllScheduledBuses({
          busStop: selectedBusStop._id, 
          status: ["On Route"],
        });
        makePeriodicAnnouncements(response);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchAndAnnounce();
    const interval = setInterval(fetchAndAnnounce, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div ref={mapRef} className="w-full h-full" />

    </div>
  );
};
