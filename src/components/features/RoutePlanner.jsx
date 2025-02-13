import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "../ui/button/Button";

const API_KEY = import.meta.env.VITE_MAP_API_KEY;

export const RoutePlanner = ({
  mapInstance,
  origin,
  destination,
  busStops,
  onWaypointsUpdated,
  waypoints,
  setWaypoints
}) => {
  const [routes, setRoutes] = useState([]);
  const [routeDistance, setRouteDistance] = useState(0);
  const [routeDuration, setRouteDuration] = useState(0);
  const [filteredWaypoints, setFilteredWaypoints] = useState([]);

  useEffect(() => {
    if (!mapInstance || !origin || !destination || !busStops) return;

    markStops(busStops);

    setFilteredWaypoints(
      waypoints.filter((p) => p?._id !== origin?._id && p?._id !== destination?._id)
    );

    const fullWaypoints = [origin, ...filteredWaypoints, destination];
    fetchRoute(fullWaypoints);
  }, [mapInstance, origin, destination, busStops, waypoints]);

  const fetchRoute = (waypointsList) => {
    if (!mapInstance || waypointsList.length < 2) return;

    const coordinates = waypointsList.map((p) => [p?.coordinates?.lng, p?.coordinates?.lat]);
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(
      ";"
    )}.json?access_token=${API_KEY}&geometries=geojson&overview=full&alternatives=false`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes[0].geometry.coordinates;
        drawRoute(route);
        setRoutes([{ route, id: Date.now() }]);
        const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
        const durationMin = (data.routes[0].duration / 60).toFixed(2);

        setRouteDistance(distanceKm);
        setRouteDuration(durationMin);
        onWaypointsUpdated({
          waypoints: waypointsList.map((p) => p?._id),
          distance: parseFloat(distanceKm),
          duration: parseFloat(durationMin),
        });
      })
      .catch((err) => console.error("Error fetching directions:", err));
  };

  const markStops = (points) => {
    if (!mapInstance) return;
    try {
      points.forEach((point) => {
        new mapboxgl.Marker({ color: "red" })
          .setLngLat([point?.coordinates?.lng, point?.coordinates?.lat])
          .setPopup(new mapboxgl.Popup().setText(`Bus Stop: ${point?.name}`))
          .addTo(mapInstance)
          .getElement()
          .addEventListener("click", () => {
            setWaypoints((prevWaypoints) => {
              const newWaypoints = [...prevWaypoints, point];
              fetchRoute([origin, ...newWaypoints, destination]);
              return newWaypoints;
            });
          });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeWaypoint = (index) => {
    setWaypoints((prevWaypoints) => {
      const updatedWaypoints = prevWaypoints.filter((_, i) => i !== index);
      fetchRoute([origin, ...updatedWaypoints, destination]);
      return updatedWaypoints;
    });
  };

  const drawRoute = (coordinates) => {
    if (!mapInstance) return;
    const routeSourceId = "route-source";
    const routeLayerId = "route-layer";

    if (mapInstance.getSource(routeSourceId)) {
      mapInstance.getSource(routeSourceId).setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      });
    } else {
      mapboxgl.accessToken = API_KEY;
      mapInstance.addSource(routeSourceId, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } },
      });
      mapInstance.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeSourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ff0000", "line-width": 4 },
      });
    }
  };

  return (
    <div className="w-80 h-full bg-white shadow-lg border absolute bottom-0 top-0 right-0 p-4 flex flex-col">
      <h4 className="text-lg font-semibold mb-2">Route Information</h4>
      <p className="text-sm text-gray-600">Distance: {routeDistance} km</p>
      <p className="text-sm text-gray-600">Duration: {routeDuration} mins</p>
      <div className="mt-4 w-full flex-1 overflow-y-auto border rounded p-2 font-mono">
        {[origin, ...filteredWaypoints, destination].length === 0 ? (
          <p className="text-gray-500">No stops added yet.</p>
        ) : (
          [origin, ...filteredWaypoints, destination].map((stop, index) => (
            <div
              key={index}
              className="flex w-full justify-between items-center p-2 bg-gray-100 rounded mb-2"
            >
              <span className="text-sm font-medium">
                {index + 1}. {stop?.name}
              </span>
              {index !== 0 && index !== filteredWaypoints.length + 1 && ( // Prevent delete button for destination
                <div>
                  <Button
                    intent="destructive"
                    onClick={() => removeWaypoint(index )}
                    startIcon={"material-symbols:delete-rounded"}
                  />
                </div>
              )}
            </div>
          ))          
        )}
      </div>
    </div>
  );
};
