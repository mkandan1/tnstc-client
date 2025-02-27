import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const HomeHeader = ({ busStops, selectedBusStop, setSelectedBusStop }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBusStops, setFilteredBusStops] = useState(busStops);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const filteredStops = busStops.filter((stop) =>
            stop.name.toLowerCase().includes(searchQuery?.toLowerCase())
        );
        setFilteredBusStops(filteredStops);
    }, [searchQuery, busStops]);

    useEffect(() => {
        setSearchQuery(selectedBusStop?.name)
    }, [selectedBusStop])

    const handleBusStopSelect = (stop) => {
        setSelectedBusStop(stop);
        localStorage.setItem("selectedBusStop", JSON.stringify(stop));
        setSearchQuery(stop.name); // Set the input value to the selected bus stop name
        setShowSuggestions(false); // Close suggestions after selection
    };

    return (
        <div className="absolute top-0 left-0 right-0 z-20 text-white px-4 py-2 flex items-center justify-between border-0 shadow-2xl shadow-black">
            <div className="bg-black w-full h-full opacity-40 absolute top-0 left-0 right-0 z-10"></div>
            <div className="z-40 flex justify-between items-center w-full h-full">
                {/* Left: Logo */}
                <div className="flex items-center gap-2 z-40">
                    <img src="/bus.png" alt="FlightTracker" className="h-8" />
                    <span className="text-lg font-bold">BusTracker</span>
                </div>

                {/* Center: Search Bar */}
                <div className="relative w-1/3 z-40">
                    <input
                        type="text"
                        placeholder="Find bus, stops and more"
                        className="w-full px-4 py-1 text-gray-700 rounded-md"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true); // Show suggestions when typing
                        }}
                        onFocus={() => setShowSuggestions(true)} // Show suggestions when input is focused
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Hide suggestions when focus is lost
                    />
                    <Icon
                        icon="mdi:magnify"
                        className="absolute right-2 top-2 text-gray-500"
                        width="20"
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-700 shadow-md max-h-60 overflow-y-auto rounded-md z-50">
                            {filteredBusStops.length > 0 ? (
                                filteredBusStops.map((stop) => (
                                    <div
                                        key={stop._id}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                        onClick={() => handleBusStopSelect(stop)}
                                    >
                                        {stop.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500">No results found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Icons */}
                <div className="flex items-center gap-4">
                    <Link to={'/login'}>
                        <Icon
                            icon="mdi:account-circle"
                            className="cursor-pointer hover:text-gray-300"
                            width="24"
                        />
                    </Link>
                    <Icon
                        icon="mdi:menu"
                        className="cursor-pointer hover:text-gray-300"
                        width="24"
                    />
                </div>
            </div>

            {/* Bus Stop Select Menu (Optional fallback) */}
            {/* <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-full z-40">
        <select
          value={selectedBusStop ? selectedBusStop._id : ""}
          onChange={(e) => {
            const stop = busStops.find((stop) => stop._id === e.target.value);
            handleBusStopSelect(stop);
          }}
          className="w-full px-4 py-1 text-black rounded-md"
        >
          <option value="">Select a Bus Stop</option>
          {filteredBusStops.map((stop) => (
            <option key={stop._id} value={stop._id}>
              {stop?.name}
            </option>
          ))}
        </select>
      </div> */}
        </div>
    );
};
