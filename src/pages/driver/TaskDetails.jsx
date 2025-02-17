import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { scheduledBusService, urlService } from "../../services";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";

const TaskDetails = () => {
  const taskId = urlService.getId(); // Getting the taskId from the URL
  const [taskDetails, setTaskDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const navigate = useNavigate();

  console.log("Component Loaded - Task ID:", taskId);

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        console.log("Fetching task details...");
        const response = await scheduledBusService.getScheduledBusById(taskId);
        console.log("Task details received:", response);
        setTaskDetails(response);
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) fetchTaskDetails();
  }, [taskId]);

  // Start Ride
  const handleStartRide = async () => {
    console.log("Start Ride button clicked");
  
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      setLocationPermissionDenied(true);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("User location retrieved:", position.coords);
  
        try {
          console.log("Sending start ride request...");
          await scheduledBusService.startRide(taskId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
  
          alert("Ride started successfully.");
  
          // ✅ Make sure status remains 'On Route'
          setTaskDetails((prev) => ({ ...prev, status: "On Route" }));
  
          // ✅ Start location tracking
          console.log("Starting location tracking...");
          startLocationTracking();
        } catch (err) {
          console.error("Error starting the ride:", err);
          alert("Failed to start the ride. Please try again.");
        }
      },
      (error) => {
        console.error("Location access denied:", error.message);
        setLocationPermissionDenied(true);
        alert("Please allow location access to start the ride.");
      }
    );
  };
  

  // Start automatic location updates every 10 seconds
  const startLocationTracking = () => {
    if (locationUpdateInterval) {
      console.log("Location tracking is already running");
      return;
    }
  
    console.log("Setting up location tracking interval...");
  
    const intervalId = setInterval(() => {
      console.log("Checking ride status before updating location...");
  
      if (taskDetails?.status === "Completed") {
        console.log("Ride marked as completed, stopping location tracking.");
        clearInterval(intervalId);
        setLocationUpdateInterval(null);
        return;
      }
  
      console.log("Fetching user location for update...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("New location retrieved:", position.coords);
  
          try {
            console.log("Sending location update to API...");
            await scheduledBusService.updateBusLocation(taskId, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
  
            console.log("✅ Location updated successfully in backend.");
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } catch (err) {
            console.error("❌ Error updating bus location:", err);
          }
        },
        (error) => {
          console.error("❌ Error getting location:", error.message);
        }
      );
    }, 5000); // Updates location every 10 seconds
  
    console.log("✅ Location tracking started. Interval ID:", intervalId);
    setLocationUpdateInterval(intervalId);
  };
  

  // Stop Ride
  const handleCompleteRide = async () => {
    console.log("Complete Ride button clicked");

    try {
      console.log("Sending complete ride request...");
      await scheduledBusService.completeRide(taskId);
      alert("Ride completed successfully.");

      setTaskDetails((prev) => ({ ...prev, status: "Completed" }));

      console.log("Stopping location tracking...");
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        setLocationUpdateInterval(null);
      }
    } catch (err) {
      console.error("Error completing the ride:", err);
      alert("Failed to complete the ride.");
    }
  };

  // Stop location tracking when component unmounts
  useEffect(() => {
    return () => {
      if (locationUpdateInterval) {
        console.log("Component unmounting, clearing location tracking...");
        clearInterval(locationUpdateInterval);
      }
    };
  }, [locationUpdateInterval]);

  const onButtonClick = (id) => {
    if (id === "start-ride") handleStartRide();
    if (id === "complete-ride") handleCompleteRide();
  };

  if (isLoading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!taskDetails) return <div className="no-task-container">No Task Found</div>;

  // Button config based on status
  const buttonConfig =
    taskDetails.status === "Scheduled"
      ? { id: "start-ride", label: "Start Ride", icon: "mdi:play" }
      : taskDetails.status === "On Route"
      ? { id: "complete-ride", label: "Complete Ride", icon: "mdi:check" }
      : null;

  return (
    <PanelContainer>
      <PageHeader
        title={`Task Details for Bus ${taskDetails.bus.busNumber}`}
        description={`Route: ${taskDetails.route.routeName}`}
        buttons={buttonConfig ? [buttonConfig] : []}
        goBack
        onButtonClick={onButtonClick}
      />

      {locationPermissionDenied && (
        <div className="error-message">
          Location services are required to start the ride. Please enable location.
        </div>
      )}

      {/* Task Details */}
      <div className="task-details-container">
        <h3>Bus Details:</h3>
        <p><strong>Bus Number:</strong> {taskDetails.bus.busNumber}</p>
        <p><strong>Driver:</strong> {taskDetails.driver.name}</p>
        <p><strong>Route Name:</strong> {taskDetails.route.routeName}</p>
        <p><strong>Scheduled Time:</strong> {new Date(taskDetails.scheduleTime).toLocaleString()}</p>
        <p><strong>Status:</strong> {taskDetails.status}</p>
      </div>

      {/* Show last updated location */}
      {currentLocation && (
        <div className="location-info">
          <h4>Last Updated Location:</h4>
          <p><strong>Latitude:</strong> {currentLocation.latitude}</p>
          <p><strong>Longitude:</strong> {currentLocation.longitude}</p>
        </div>
      )}
    </PanelContainer>
  );
};

export default TaskDetails;
