const fetchRouteFromOSM = async (origin, destination) => {
  try {
    // Geocoding using Nominatim API
    const geocode = async (place) => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`);
      const data = await response.json();
      return data[0];
    };

    const originData = await geocode(origin);
    const destinationData = await geocode(destination);

    if (!originData || !destinationData) {
      throw new Error('Invalid origin or destination.');
    }

    // Routing using OSRM API
    const osrmResponse = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${originData.lon},${originData.lat};${destinationData.lon},${destinationData.lat}?overview=full&geometries=geojson`
    );

    const osrmData = await osrmResponse.json();
    const route = osrmData.routes[0];

    return {
      origin: { name: origin, coordinates: { lat: parseFloat(originData.lat), lon: parseFloat(originData.lon) } },
      destination: { name: destination, coordinates: { lat: parseFloat(destinationData.lat), lon: parseFloat(destinationData.lon) } },
      waypoints: osrmData.waypoints,
      distance: route.distance / 1000, // Convert meters to kilometers
      duration: route.duration / 60, // Convert seconds to minutes
      geometry: route.geometry,
    };
  } catch (error) {
    console.error('Error fetching route from OSM:', error.message);
    throw error;
  }
};

export default fetchRouteFromOSM;
