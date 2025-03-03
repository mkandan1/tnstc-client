import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { convertToIST, getISTTime } from '../../util/convertToIST';
import { calculateETA, calculateStartTime, getTimeAgo } from '../../util/time';
import wsService from '../../services/webSocketService';

const LeftSidePanel = ({ selectedBusStop }) => {
    const [scheduledBuses, setScheduledBuses] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedBus, setSelectedBus] = useState(null);

    useEffect(() => {
        if (!selectedBusStop?._id) return;

        const handleWebSocketMessage = (data) => {
            if (data.type === "busStopResponse") {
                setScheduledBuses(data.buses);
            }
        };

        wsService.addMessageHandler(handleWebSocketMessage);

        const intervalId = setInterval(() => {
            wsService.requestScheduledBuses(selectedBusStop._id, ['On Route', 'Scheduled']);
        }, 1000);

        return () => {
            wsService.messageHandlers = wsService.messageHandlers.filter(handler => handler !== handleWebSocketMessage);
            clearInterval(intervalId);
        };
    }, [selectedBusStop]);



    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const selectBus = (bus) => {
        setSelectedBus(bus);
    };

    const goBackToList = () => {
        setSelectedBus(null);
    };

    const checkIfBusLeftStop = (bus, selectedBusStop) => {
        const leftAtStop = bus.leftAt.find(item => item.stop.toString() === selectedBusStop._id.toString());

        if (leftAtStop) {

            const formattedTime = getISTTime(leftAtStop.time);

            return formattedTime;
        }

        return null;
    };



    return (
        <div className="text-white bg-[#303030] z-20 absolute top-20 left-5 md:left-10 shadow-lg rounded-lg w-80">
            {!selectedBus ? (
                <>
                    <div className={`flex justify-between items-center p-2 rounded-lg transition-all duration-150 ${isExpanded && 'rounded-b-none'} bg-[#4D4D4D]`}>
                        <h3 className="font-bold text-sm">Buses</h3>

                        <button onClick={toggleExpand}>
                            <Icon icon={isExpanded ? "ic:baseline-expand-less" : "ic:baseline-expand-more"} className="text-white size-6" />
                        </button>

                    </div>

                    {isExpanded && (
                        <div className="space-y-4 m-2 mb-3">
                            {scheduledBuses.length > 0 ? (
                                scheduledBuses.map((bus, i) => (
                                    <div
                                        key={bus._id}
                                        className="rounded-lg bg-[#414141] p-2 m-1 transition-shadow duration-300 cursor-pointer"
                                        onClick={() => selectBus(bus)}
                                    >
                                        <div className='flex justify-between'>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-bold text-sm">{i + 1}. {bus.bus?.busNumber}</h3>

                                                <div
                                                    className={`text-[9px] text-white p-0.5 px-2 rounded-full flex items-center space-x-1 
                                ${bus.status === 'Scheduled' ? 'bg-blue-500' : bus.status === 'On Route' ? 'bg-green-500' : 'bg-gray-500'}`}>

                                                    <Icon icon={bus.status === 'Scheduled' ? 'ic:baseline-schedule' :
                                                        bus.status === 'On Route' ? 'mdi:bus' :
                                                            'mdi:check-circle'}
                                                        className="size-3" />

                                                    <p className='mt-0.5'>{bus.status}</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center text-sm space-x-1 text-yellow-400'>
                                                <Icon icon={'heroicons:user-group-solid'} />
                                                <p className='text-xs'>{bus.bus.passengerCapacity}</p>
                                            </div>
                                        </div>
                                        {bus.route.routeName.includes(" to ") ? (
                                            <p className="text-gray-400 text-sm flex space-x-2 items-center">
                                                <span className="font-semibold">{bus.route?.origin?.name}</span>
                                                <span className="text-gray-50"> <Icon icon='uil:exchange' /> </span>
                                                <span className="font-semibold">{bus.route?.destination?.name}</span>
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">{bus.route.routeName}</p>
                                        )}

                                        <div className="mt-2 flex flex-col gap-2 bg-[#4f4f4f] text-white p-3 rounded-lg shadow-md">
                                            <div className="flex items-center space-x-2">
                                                {bus.status === "Scheduled" ? (
                                                    <Icon icon="mdi:clock-outline" className="text-yellow-400 text-lg" />
                                                ) : checkIfBusLeftStop(bus, selectedBusStop) ? (
                                                    <Icon icon="mdi:check-circle-outline" className="text-green-400 text-lg" />
                                                ) : (
                                                    <Icon icon="mdi:map-marker-outline" className="text-blue-400 text-lg" />
                                                )}

                                                {bus.status === "Scheduled" ? (
                                                    <p className="text-sm font-medium">
                                                        Starting in:
                                                        <span className="text-yellow-300 font-semibold ml-1">
                                                            {calculateStartTime(bus.scheduleTime)}
                                                        </span>
                                                    </p>
                                                ) : (
                                                    <>
                                                        {checkIfBusLeftStop(bus, selectedBusStop) ? (
                                                            // If bus has left, show "Arrived at"
                                                            <p className="text-sm font-medium">
                                                                Arrived at
                                                                <span className="text-yellow-300 font-semibold ml-1">
                                                                    {selectedBusStop.name}
                                                                </span> at
                                                                <span className="text-yellow-300 font-semibold ml-1">
                                                                    {checkIfBusLeftStop(bus, selectedBusStop)}
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            // If bus hasn't left, show "Arriving in"
                                                            <p className="text-sm font-medium">
                                                                Arriving <span className="text-yellow-300 font-semibold ml-1">
                                                                    {selectedBusStop.name}
                                                                </span>
                                                                <span className="text-yellow-300 font-semibold ml-1">
                                                                    {calculateETA(bus, selectedBusStop)}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>


                                            {bus.status !== "Scheduled" && checkIfBusLeftStop(bus, selectedBusStop) && (
                                                <div className="flex items-center space-x-2 text-gray-200">
                                                    <Icon icon="mdi:map-marker-outline" className="text-gray-200 text-lg" />
                                                    <p className="text-sm font-medium">
                                                        Left <span className="text-yellow-300 font-semibold">{selectedBusStop.name}</span> at
                                                        <span className="text-yellow-300 font-semibold ml-1">
                                                            {checkIfBusLeftStop(bus, selectedBusStop)}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-2">No scheduled buses available.</p>
                            )}
                        </div>
                    )}

                </>
            ) : (
                <div className="mt-3">
                    <div className='mx-2 flex justify-between'>
                        <div className='mb-2'>
                            <div className='flex items-center space-x-2'>
                                <h3 className='text-lg font-semibold text-yellow-300'>{selectedBus.bus.busNumber}</h3>
                                <div
                                    className={`text-[9px] text-white p-0.5 px-2 rounded-full flex items-center space-x-1 
                                                ${selectedBus.status === 'Scheduled' ? 'bg-blue-500' : selectedBus.status === 'On Route' ? 'bg-green-500' : 'bg-gray-500'}`}>

                                    <Icon icon={selectedBus.status === 'Scheduled' ? 'ic:baseline-schedule' :
                                        selectedBus.status === 'On Route' ? 'mdi:bus' :
                                            'mdi:check-circle'}
                                        className="size-3" />

                                    <p className='mt-0.5'>{selectedBus.status}</p>
                                </div>
                            </div>
                            <div>
                                <h4>{selectedBus.bus.busName}</h4>
                            </div>
                        </div>
                        <button onClick={goBackToList} className="flex items-center text-blue-400 mb-3">
                            <Icon icon="ic:close" className="size-5 mr-1" />
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
                        <img
                            src={selectedBus.bus.busImage}
                            alt="private bus"
                            className="h-52 w-full shadow-xl relative z-0"
                        />
                    </div>
                    {selectedBus.route.routeName.includes(" to ") ? (
                        <div className="bg-gray-100 p-4 shadow-md w-full max-w-md">
                            {/* Top Section */}
                            <div className="flex items-center justify-between border-b pb-2">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">{selectedBus.route.origin.code}</div>
                                    <div className="text-sm text-gray-500">{selectedBus.route.routeName.split(" to ")[0]}</div>
                                    <div className="text-xs text-gray-400">IST (UTC +5:30)</div>
                                </div>

                                {/* Divider with Icon */}
                                <div className="relative flex flex-col items-center">
                                    <div className="absolute h-full w-1 bg-white"></div>
                                    <div className="bg-white p-3 rounded-full shadow-lg relative z-10">
                                        <Icon icon="solar:bus-bold" className="text-yellow-500 text-2xl" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">{selectedBus.route.destination.code}</div>
                                    <div className="text-sm text-gray-500">{selectedBus.route.routeName.split(" to ")[1]}</div>
                                    <div className="text-xs text-gray-400">IST (UTC +5:30)</div>
                                </div>
                            </div>

                            {/* Schedule & Actual Timing */}
                            <div className="mt-2 text-sm grid gap-y-1">
                                {/* First row: Scheduled times */}
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400 whitespace-nowrap">Scheduled:</span>
                                        <span className="font-semibold text-gray-400 whitespace-nowrap uppercase">{getISTTime(selectedBus.scheduleTime)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400 whitespace-nowrap">Scheduled:</span>
                                        <span className="font-semibold text-gray-400 whitespace-nowrap uppercase">{getISTTime(selectedBus.scheduledArrivalTime)}</span>
                                    </div>
                                </div>

                                {/* Second row: Actual & Estimated times */}
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400 whitespace-nowrap">Actual:</span>
                                        <span className="font-semibold text-gray-400 whitespace-nowrap uppercase">{getISTTime(selectedBus.actualTime)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-400 whitespace-nowrap">Estimated:</span>
                                        <span className="font-semibold text-red-500 whitespace-nowrap uppercase">{getISTTime(selectedBus.estimatedArrivalTime)}</span>
                                    </div>
                                </div>
                            </div>


                            {/* Progress Bar */}
                            <div className="mt-5 relative">
                                <div className="w-full h-1 bg-gray-300 rounded-full">
                                    <div className="h-1 bg-yellow-500 rounded-full" style={{ width: `${selectedBus.journeyCompletion}%` }}></div>
                                </div>
                                <div
                                    className="absolute top-[-10px] transform -translate-x-1/2 border border-yellow-300 bg-white p-1 rounded-full"
                                    style={{ left: `${selectedBus.journeyCompletion}%` }}
                                >
                                    <Icon icon="mingcute:bus-2-fill" className="text-gray-700 text-lg" />
                                </div>

                            </div>

                            {/* Distance & Time Remaining */}
                            <div className="flex justify-between text-xs text-gray-500 mt-5">
                                <span>{selectedBus.distanceTraveled} km, {getTimeAgo(selectedBus.actualTime)}</span>
                                <span>{selectedBus.distanceRemaining} km, {calculateETA(selectedBus, selectedBus.destination)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-5">
                                <span>{selectedBus.speed | 0} km speed</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">{selectedBus.route.routeName}</p>
                    )}

                    <div className='p-1 py-5 relative'>
                        <p className='text-xs text-gray-500'>Real time tracking provided by HypeSquad - M.A.M College of Engineering and Technology, Siruganur, Trichy</p>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-600 rounded-lg"></div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default LeftSidePanel;
