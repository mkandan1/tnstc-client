import React, { useEffect, useState } from "react";
import { TabContainer } from "../../components/Layouts/TabContainer";
import { Tabs, TextInput } from "flowbite-react";
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/Layouts/Modal";
import { RoutePlanner } from "../../components/features/RoutePlanner";
import { PanelContainer } from '../../components/Layouts/Container';
import PageHeader from "../../components/Layouts/PageHeader";
import { MapContainer } from "../../components/features/MapContainer";
import { busStopService, routeService } from '../../services';
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;

const CreateRoute = () => {
  const [userQuery, setUserQuery] = useState({ origin: "", destination: "" });
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busStops, setBusStops] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createdRoute, setCreatedRoute] = useState();

  useEffect(() => {
    let isMounted = true;

    const fetchBusStops = async () => {
      try {
        const response = await busStopService.getAllBusStops();
        if (isMounted) {
          const formattedData = response.busStops.map((stop) => ({
            ...stop,
            active: stop.active ? "Active" : "Inactive",
          }));
          setBusStops(formattedData); // Store bus stops in state
        }
      } catch (err) {
        console.error("Error fetching bus stops:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBusStops();

    return () => {
      isMounted = false;
    };
  }, []);

  const filterBusStops = (query) => {
    return busStops.filter((stop) =>
      stop.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleInputChange = (e, setSuggestions, isOrigin = true) => {
    const { value } = e.target;
    setUserQuery((prev) => ({ ...prev, [isOrigin ? "origin" : "destination"]: value }));
    if (value.length < 2) {
      setSuggestions([]);
    } else {
      const suggestions = filterBusStops(value);
      setSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (suggestion, isOrigin = true) => {
    setUserQuery((prev) => ({
      ...prev,
      [isOrigin ? "origin" : "destination"]: suggestion,
    }));
    isOrigin ? setOriginSuggestions([]) : setDestinationSuggestions([]);
  };

  const saveRoute = async () => {
    if (!userQuery.origin || !userQuery.destination || !createdRoute) {
      toast.error("Please enter origin, destination, and generate a route.");
      return;
    }
  
    const routeData = {
      routeName: `${userQuery.origin.name} to ${userQuery.destination.name}`,
      origin: userQuery.origin._id,
      destination: userQuery.destination._id,
      totalDistance: createdRoute.distance,
      totalDuration: createdRoute.duration,
      stops: createdRoute.waypoints.map((stop, index) => ({
        stopId: stop.id,
        stopOrder: stop.stopOrder,
        distanceFromOrigin: stop.distanceFromOrigin
      })),
      routeType: "Urban", // Change based on user selection if needed
      isActive: true,
    };
  
    try {
      const response = await routeService.createRoute(routeData);
      toast.success("Route saved successfully!");
      console.log("Saved route:", response);
    } catch (error) {
      console.error("Error saving route:", error);
      toast.error("Failed to save route. Please try again.");
    }
  };

  const handleWaypointsUpdated = (data) => {
    console.log("Updated waypoints: ", data);
    setCreatedRoute(data)

  };

  return (
    <PanelContainer>
      <PageHeader
        title="Create Route"
        description="Fill in the details to create a new route"
        buttons={[{ id: "create-route", label: "Save Route" }]}
        goBack={true}
        onButtonClick={()=> saveRoute()}
      />
      <TabContainer>
        <Tabs>
          <Tabs.Item title="Route">
            <div className="space-y-6 w-96 relative">
              {/* Origin Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter origin
                </label>
                <TextInput
                  type="text"
                  placeholder="Origin"
                  value={userQuery.origin?.name}
                  onChange={(e) => handleInputChange(e, setOriginSuggestions, true)}
                />
                {originSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white shadow-lg w-full mt-1 max-h-60 overflow-auto">
                    {originSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(suggestion, true)}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Destination Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter destination
                </label>
                <TextInput
                  type="text"
                  placeholder="Destination"
                  value={userQuery.destination?.name}
                  onChange={(e) => handleInputChange(e, setDestinationSuggestions, false)}
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white shadow-lg w-full mt-1 max-h-60 overflow-auto">
                    {destinationSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(suggestion, false)}
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button
                label={"Fetch map"}
                startIcon={"majesticons:map-marker"}
                onClick={() => {
                  if (userQuery.origin && userQuery.destination) {
                    setIsModalOpen(true);
                  }
                }}
                disabled={!userQuery.origin || !userQuery.destination}
              />
            </div>
          </Tabs.Item>
        </Tabs>
      </TabContainer>

      <Modal
        isModalOpen={isModalOpen}
        onButtonClick={() => setIsModalOpen(false)}
      >
        <MapContainer>
          {(mapInstance) => (
            <RoutePlanner
            mapInstance={mapInstance}
            origin={userQuery.origin}
            destination={userQuery.destination}
            busStops={busStops}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            onWaypointsUpdated={handleWaypointsUpdated}
          />
          )}
        </MapContainer>
      </Modal>
    </PanelContainer>
  );
};

export default CreateRoute;
