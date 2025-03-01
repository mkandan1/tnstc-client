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

        // Calculate distance from origin for each stop
        let cumulativeDistance = 0;
        const updatedWaypoints = waypointsList.map((stop, index) => {
          if (index > 0) {
            const prev = waypointsList[index - 1];
            cumulativeDistance += getDistance(prev, stop);
          }
          return {
            id: stop._id,
            distanceFromOrigin: cumulativeDistance.toFixed(2),
            stopOrder: index + 1, // Order starts from 1 (origin = 1, waypoints in between, destination last)
          };
        });

        onWaypointsUpdated({
          waypoints: updatedWaypoints,
          distance: parseFloat(distanceKm),
          duration: parseFloat(durationMin),
        });
      })
      .catch((err) => console.error("Error fetching directions:", err));
  };

  const getDistance = (point1, point2) => {
    const R = 6371; // Radius of Earth in km
    const lat1 = point1.coordinates.lat;
    const lon1 = point1.coordinates.lng;
    const lat2 = point2.coordinates.lat;
    const lon2 = point2.coordinates.lng;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
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

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedItemIndex === index) return;
    const updatedWaypoints = [...waypoints];
    const item = updatedWaypoints.splice(draggedItemIndex, 1)[0];
    updatedWaypoints.splice(index, 0, item);
    setWaypoints(updatedWaypoints);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    fetchRoute([origin, ...waypoints, destination]);
    setDraggedItemIndex(null);
  };

  return (
    <div className="w-80 h-full bg-white shadow-lg border absolute bottom-0 top-0 right-0 p-4 flex flex-col">
      <h4 className="text-lg font-semibold mb-2">Route Information</h4>
      <p className="text-sm text-gray-600">Distance: {routeDistance} km</p>
      <p className="text-sm text-gray-600">Duration: {routeDuration} mins</p>

      <div className="mt-4 w-full flex-1 overflow-y-auto border rounded p-2 font-mono">
        {[origin, ...waypoints, destination].map((stop, index) => (
          <div
            key={stop?._id}
            draggable={index !== 0 && index !== waypoints.length + 1} // Prevent dragging origin & destination
            onDragStart={() => handleDragStart(index - 1)}
            onDragOver={() => handleDragOver(index - 1)}
            onDragEnd={handleDragEnd}
            className="flex w-full justify-between items-center p-2 bg-gray-100 rounded mb-2 cursor-move"
          >
            <span className="text-sm font-medium">
              {index + 1}. {stop?.name}
            </span>
            {index !== 0 && index !== waypoints.length + 1 && ( // Prevent delete button for origin & destination
              <Button
                intent="destructive"
                onClick={() => setWaypoints(waypoints.filter((_, i) => i !== index - 1))}
                startIcon={"material-symbols:delete-rounded"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
