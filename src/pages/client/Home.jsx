import React, { useEffect, useState } from "react";
import { LiveTrackingMap } from "../../components/features/LiveTrackingMap";
import { HomeHeader } from "../../components/Layouts/HomeHeader";
import { busStopService } from "../../services"; // Assuming the busStopService is being used for fetching stops
import LeftSidePanel from "../../components/Layouts/LeftSidePanel";

const Home = () => {
  const [busStops, setBusStops] = useState([]);
  const [selectedBusStop, setSelectedBusStop] = useState(null);

  // Fetch all bus stops
  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const response = await busStopService.getAllBusStops();
        setBusStops(response.busStops); // Assuming response contains busStops
      } catch (error) {
        console.error("Error fetching bus stops:", error);
      }
    };
    const stop = JSON.parse(localStorage.getItem('selectedBusStop'));
    setSelectedBusStop(stop)
    fetchBusStops();
  }, []);

  // Handle bus stop selection
  const handleBusStopSelect = (stop) => {
    setSelectedBusStop(stop); // Set the selected bus stop
  };


  return (
    <div className="relative">
      <HomeHeader
        busStops={busStops}
        selectedBusStop={selectedBusStop}
        setSelectedBusStop={setSelectedBusStop}
      />
      <LeftSidePanel selectedBusStop={selectedBusStop}/>
      <LiveTrackingMap selectedBusStop={selectedBusStop} />
    </div>
  );
};

export default Home;
