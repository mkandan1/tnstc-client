import React, { useEffect, useState } from "react";
import { TabContainer } from "../../components/Layouts/TabContainer";
import { Tabs, Select } from "flowbite-react";  // Use Select component
import { Button } from "../../components/ui/button/Button";
import { Modal } from "../../components/Layouts/Modal";
import { RoutePlanner } from "../../components/features/RoutePlanner";
import { PanelContainer } from '../../components/Layouts/Container';
import PageHeader from "../../components/Layouts/PageHeader";
import { MapContainer } from "../../components/features/MapContainer";
import { busStopService, routeService } from '../../services';
import { getId } from "../../services/url.service";

const EditRoute = () => {
    const routeId = getId();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [routeData, setRouteData] = useState(null);
    const [userQuery, setUserQuery] = useState({ origin: null, destination: null });
    const [busStops, setBusStops] = useState([]);
    const [waypoints, setWaypoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
    
        const fetchBusStops = async () => {
            try {
                const response = await busStopService.getAllBusStops();
                if (isMounted) {
                    setBusStops(response.busStops);
                }
            } catch (err) {
                console.error("Error fetching bus stops:", err.message);
            }
        };
    
        const fetchRouteDetails = async () => {
            try {
                const response = await routeService.getRouteById(routeId);
                if (!response) return;
        
                setRouteData(response);
        
                setUserQuery({
                    origin: response.origin,
                    destination: response.destination,
                });
        
                const updatedWaypoints = response.stops.map(item => item.stopId)
                setWaypoints(updatedWaypoints);
                
            } catch (err) {
                console.error("Error fetching route details:", err);
            }
        };
        
    
        fetchBusStops().then(fetchRouteDetails);
        return () => { isMounted = false; };
    }, []);
    

    const handleSelectChange = (e, isOrigin = true) => {
        const selectedStop = busStops.find((stop) => stop._id === e.target.value);
        const key = isOrigin ? "origin" : "destination";

        if (selectedStop) {
            setUserQuery((prev) => ({
                ...prev,
                [key]: {
                    name: selectedStop.name,
                    _id: selectedStop._id,
                },
            }));
        }

        console.log(userQuery)
    };

    const saveRoute = async () => {
        if (!userQuery.origin || !userQuery.destination || !routeData) {
            alert("Please enter origin, destination, and generate a route.");
            return;
        }

        const updatedRouteData = {
            routeName: `${userQuery.origin.name} to ${userQuery.destination.name}`,
            origin: userQuery.origin._id,
            destination: userQuery.destination._id,
            totalDistance: routeData.distance,
            totalDuration: routeData.duration,
            stops: waypoints.map((stop, index) => ({
                stopId: stop._id,
                stopOrder: index + 1,
            })),
        };
        console.log(updatedRouteData)
        try {
            await routeService.updateRoute(routeId, updatedRouteData);
            alert("Route updated successfully!");
        } catch (error) {
            console.error("Error updating route:", error);
            alert("Failed to update route. Please try again.");
        }
    };

    const onWaypointsUpdated = (data) => {
        setRouteData(data)
    }

    return (
        <PanelContainer>
            <PageHeader
                title="Edit Route"
                description="Modify the route details and waypoints"
                buttons={[{ id: "edit-route", label: "Save Changes" }]}
                goBack={true}
                onButtonClick={saveRoute}  // Fixed missing parentheses
            />
            <TabContainer>
                <Tabs>
                    <Tabs.Item title="Route">
                        <div className="space-y-6 w-96 relative">
                            
                            {/* Origin Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Origin
                                </label>
                                <Select onChange={(e) => handleSelectChange(e, true)} value={userQuery.origin?._id || ""}>
                                    <option value="" disabled>Select an origin</option>
                                    {busStops.map((stop) => (
                                        <option key={stop._id} value={stop._id}>
                                            {stop.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Destination Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Select Destination
                                </label>
                                <Select onChange={(e) => handleSelectChange(e, false)} value={userQuery.destination?._id || ""}>
                                    <option value="" disabled>Select a destination</option>
                                    {busStops.map((stop) => (
                                        <option key={stop._id} value={stop._id}>
                                            {stop.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <Button
                                label={"Edit Route"}
                                startIcon={"majesticons:map-marker"}
                                onClick={() => setIsModalOpen(true)}
                                disabled={!userQuery.origin || !userQuery.destination}
                            />
                        </div>
                    </Tabs.Item>
                </Tabs>
            </TabContainer>

            <Modal isModalOpen={isModalOpen} onButtonClick={() => setIsModalOpen(false)}>
                <MapContainer>
                    {(mapInstance) => (
                        <RoutePlanner
                            mapInstance={mapInstance}
                            origin={userQuery.origin}
                            destination={userQuery.destination}
                            busStops={busStops}
                            waypoints={waypoints}
                            setWaypoints={setWaypoints}
                            onWaypointsUpdated={onWaypointsUpdated}
                        />
                    )}
                </MapContainer>
            </Modal>
        </PanelContainer>
    );
};

export default EditRoute;
