import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scheduledBusService, urlService } from '../../services';
import { PanelContainer } from '../../components/Layouts/Container';
import PageHeader from '../../components/Layouts/PageHeader';

const TaskDetails = () => {
  const taskId = urlService.getId(); // Getting the taskId from the URL
  const [taskDetails, setTaskDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [location, setLocation] = useState(null); // To store the location
  const navigate = useNavigate();
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await scheduledBusService.getScheduledBusById(taskId);
        setTaskDetails(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleStartRide = async () => {
    if (!navigator.geolocation) {
      setLocationPermissionDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        try {
          await scheduledBusService.startRide(taskId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          alert('Ride started successfully.');

          // Update taskDetails to reflect the new status
          setTaskDetails((prev) => ({ ...prev, status: 'On Route' }));

          // Start location tracking
          startLocationTracking();
        } catch (err) {
          console.error('Error starting the ride:', err);
        }
      },
      () => {
        setLocationPermissionDenied(true);
      }
    );
  };

  const startLocationTracking = () => {
    if (locationUpdateInterval) return; // Prevent multiple intervals
  
    const intervalId = setInterval(async () => {
      try {
        if (taskDetails.status !== 'On Route') {
          clearInterval(intervalId);
          setLocationUpdateInterval(null);
          return; 
        }
  
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await scheduledBusService.updateBusLocation(taskId, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } catch (err) {
        console.error('Error updating bus location:', err);
      }
    }, 1000); // 1-minute interval
  
    setLocationUpdateInterval(intervalId);
  };
  
  // Stop location tracking when the ride is completed
  const handleCompleteRide = async () => {
    try {
      await scheduledBusService.completeRide(taskId);
      alert('Ride completed successfully.');
  
      setTaskDetails((prev) => ({ ...prev, status: 'Completed' }));
  
      // Stop tracking location
      if (locationUpdateInterval) {
        clearInterval(locationUpdateInterval);
        setLocationUpdateInterval(null);
      }
    } catch (err) {
      console.error('Error completing the ride:', err);
    }
  };
  

  

const onButtonClick = (id) => {
  if (id === 'start-ride') {
    handleStartRide();
  } else if (id === 'complete-ride') {
    handleCompleteRide();
  }
};

if (isLoading) return <div className="loading-container">Loading...</div>;
if (error) return <div className="error-container">Error: {error}</div>;
if (!taskDetails) return <div className="no-task-container">No Task Found</div>;

// Conditional rendering of button based on task status
const buttonConfig = taskDetails.status === 'Scheduled'
  ? { id: 'start-ride', label: 'Start Ride', icon: 'mdi:play' }
  : taskDetails.status === 'On Route'
    ? { id: 'complete-ride', label: 'Complete Ride', icon: 'mdi:check' }
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

    {/* Displaying Task Details */}
    <div className="task-details-container">
      <h3>Bus Details:</h3>
      <p><strong>Bus Number:</strong> {taskDetails.bus.busNumber}</p>
      <p><strong>Driver:</strong> {taskDetails.driver.name}</p>
      <p><strong>Route Name:</strong> {taskDetails.route.routeName}</p>
      <p><strong>Scheduled Time:</strong> {new Date(taskDetails.scheduleTime).toLocaleString()}</p>
      <p><strong>Status:</strong> {taskDetails.status}</p>

      {/* Add more details as required */}
    </div>
  </PanelContainer>
);
};

export default TaskDetails;
