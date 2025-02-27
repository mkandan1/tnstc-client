import React, { useState, useEffect } from 'react';
import { scheduledBusService } from '../../services';
import { Icon } from '@iconify/react/dist/iconify.js';

const LeftSidePanel = ({ selectedBusStop }) => {
    const [scheduledBuses, setScheduledBuses] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    useEffect(() => {
        if (selectedBusStop) {
            const getSchedules = async () => {
                try {
                    const response = await scheduledBusService.getAllScheduledBuses({ busStop: selectedBusStop._id, status: ['Scheduled', "On Route"] });
                    if (response) {
                        setScheduledBuses(response);
                    } else {
                        console.error("Unexpected response format:", response);
                    }
                } catch (error) {
                    console.error("Error fetching schedules:", error);
                }
            };

            getSchedules();
            const intervalId = setInterval(getSchedules, 5000);
            return () => clearInterval(intervalId);
        }
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
                                                <span className="font-semibold">{bus.route.routeName.split(" to ")[0]}</span>
                                                <span className="text-gray-50"> <Icon icon='uil:exchange' /> </span>
                                                <span className="font-semibold">{bus.route.routeName.split(" to ")[1]}</span>
                                            </p>
                                        ) : (
                                            <p className="text-gray-400">{bus.route.routeName}</p>
                                        )}
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
                        <div className="text-gray-400 text-sm flex items-center justify-between bg-[#EDEDED] p-1 py-3">
                            <div className='w-2/5 text-center'>
                                <span className="font-semibold text-lg uppercase text-gray-600">{selectedBus.route.routeName.split(" to ")[0]}</span>
                            </div>
                            <div className='w-1/5 flex justify-center'>
                                <span className="text-gray-500 text-xl bg-white p-4 rounded-full"> <Icon icon='uil:exchange' className='text-yellow-300' /> </span>
                            </div>
                            <div className='w-2/5 text-center'>
                                <span className="font-semibold text-lg uppercase text-gray-600">{selectedBus.route.routeName.split(" to ")[1]}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">{selectedBus.route.routeName}</p>
                    )}

                    <div className="mt-5 bg-[#2D2D2D] p-3 rounded-lg shadow-lg text-white">
                        <div className="flex items-center space-x-2">
                            <Icon icon="subway:time-2" className="size-5 text-yellow-300" />
                            <h4 className="text-md font-semibold">Scheduled Time</h4>
                        </div>

                        <div className="mt-2 bg-[#1E1E1E] text-center p-2 rounded-md">
                            <p className="text-lg font-bold text-yellow-400">
                                {new Date(selectedBus.scheduleTime).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </p>
                            <p className="text-xl font-extrabold text-gray-100">
                                {new Date(selectedBus.scheduleTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default LeftSidePanel;
