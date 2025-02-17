import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { scheduledBusService, urlService } from "../../services";
import { PanelContainer } from "../../components/Layouts/Container";
import PageHeader from "../../components/Layouts/PageHeader";
import toast from "react-hot-toast";

const TaskDetails = () => {
  const taskId = urlService.getId(); // Getting the taskId from the URL
  const [taskDetails, setTaskDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const navigate = useNavigate();
  const geolocationOptions = {
    enableHighAccuracy: true, // Requests the most accurate location data
    timeout: 5000, // Waits a max of 5 seconds for a location response
    maximumAge: 0, // Forces the browser to get fresh location data
  };

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await scheduledBusService.getScheduledBusById(taskId);
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

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      setLocationPermissionDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {
          console.log("Sending start ride request...");
          await scheduledBusService.startRide(taskId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });


          // ✅ Make sure status remains 'On Route'
          setTaskDetails((prev) => ({ ...prev, status: "On Route" }));

          startLocationTracking();
          toast.success("Ride has been started")
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
      return;
    }


    const intervalId = setInterval(() => {

      if (taskDetails?.status === "Completed") {
        clearInterval(intervalId);
        setLocationUpdateInterval(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {

          try {
            await scheduledBusService.updateBusLocation(taskId, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy, // ✅ Track accuracy level
            });

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
        },
        geolocationOptions // ✅ Pass high accuracy options
      );

    }, 2000); // Updates location every 10 seconds

    setLocationUpdateInterval(intervalId);
  };


  // Stop Ride
  const handleCompleteRide = async () => {

    try {
      await scheduledBusService.completeRide(taskId);
      toast.success("Ride completed successfully.");

      setTaskDetails((prev) => ({ ...prev, status: "Completed" }));

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
