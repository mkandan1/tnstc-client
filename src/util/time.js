export const calculateArrivalTimes = (busLocation, traveledDistance, busStops, averageSpeed) => {
  if (!busLocation || !busStops || busStops.length === 0 || !averageSpeed) return [];

  return busStops
    .filter(stop => stop.distanceFromOrigin >= traveledDistance) // Only future stops
    .map(stop => {
      const remainingDistance = stop.distanceFromOrigin - traveledDistance; // Distance left to the stop
      const etaMinutes = (remainingDistance / averageSpeed) * 60; // Time in minutes

      return {
        stopId: stop.id,
        stopName: stop.name,
        estimatedArrivalTime: new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString(), // Convert to readable time
        remainingDistance: remainingDistance.toFixed(2),
      };
    });
};
export const calculateETA = (busData, selectedBusStop) => {
  if (!busData?.location || !selectedBusStop?.coordinates) return "Invalid data";

  const { latitude, longitude } = busData.location;
  const busSpeed = busData.speed || 30; // Default to 30 km/h if speed is 0

  const { lat, lng } = selectedBusStop.coordinates;
  const distance = haversineDistance(latitude, longitude, lat, lng); // Distance in km

  if (distance === null || isNaN(distance)) return "Unable to calculate distance";
  if (distance < 0.05) return "Arriving soon"; // Less than 50 meters
  if (busSpeed === 0) return "Bus is not moving";

  const timeInHours = distance / busSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);

  if (timeInMinutes < 60) {
    return `${timeInMinutes} min`;
  } else if (timeInHours < 24) {
    return `${Math.floor(timeInHours)} hr ${timeInMinutes % 60} min`;
  } else {
    const days = Math.floor(timeInHours / 24);
    const remainingHours = Math.floor(timeInHours % 24);
    return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hr`;
  }
};

export const calculateStartTime = (scheduleTime) => {
  if (!scheduleTime) return "No schedule time available";

  const now = new Date();
  const scheduledTime = new Date(scheduleTime);
  const diffMs = scheduledTime - now; // Difference in milliseconds

  if (diffMs <= 0) {
    return "Starting in";
  }

  const minutesRemaining = Math.floor(diffMs / (1000 * 60));
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;

  if (hoursRemaining > 0) {
    return `${hoursRemaining} hr ${mins} min`;
  } else {
    return `${mins} min`;
  }
};


// 📌 Distance Calculation Function
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};


export const getTimeAgo = (actualTime) => {
  if (!actualTime) return "Unknown";

  const actualDate = new Date(actualTime);
  const now = new Date();
  const diffMs = now - actualDate; // Difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
};

export const getRemainingTime = (estimatedArrivalTime) => {
  if (!estimatedArrivalTime) return "Unknown";

  const arrivalDate = new Date(estimatedArrivalTime);
  const now = new Date();
  const diffMs = arrivalDate - now; // Difference in milliseconds

  if (diffMs <= 0) return "Arrived"; // If the estimated time has passed

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} min`;
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};

export const calculateJourneyProgress = (busData) => {
  if (!busData?.distanceTraveled || !busData?.route?.totalDistance) return "0%";

  const { distanceTraveled, route } = busData;
  const totalDistance = route.totalDistance;

  if (totalDistance === 0) return "0%";

  const percentageCompleted = (distanceTraveled / totalDistance) * 100;

  return `${percentageCompleted.toFixed(2)}%`;
};
