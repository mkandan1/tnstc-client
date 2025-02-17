import React, { useState, useEffect } from 'react';
import { scheduledBusService } from '../../services';
import { Icon } from '@iconify/react/dist/iconify.js';

const LeftSidePanel = ({ selectedBusStop }) => {
    const [scheduledBuses, setScheduledBuses] = useState([]);

    useEffect(() => {
        if (selectedBusStop) {
            const getSchedules = async () => {
                try {
                    const response = await scheduledBusService.getAllScheduledBuses({ busStop: selectedBusStop._id, status: ['Scheduled', "On Route"] });
                    if (response) {
                        setScheduledBuses(response);  // Set data from the response
                    } else {
                        console.error("Unexpected response format:", response);
                    }
                } catch (error) {
                    console.error("Error fetching schedules:", error);
                }
            };
    
            // Initial fetch
            getSchedules();
    
            // Set up interval to update schedules every 5 seconds
            const intervalId = setInterval(getSchedules, 5000);
    
            // Clear the interval when the component unmounts or selectedBusStop changes
            return () => clearInterval(intervalId);
        }
    }, [selectedBusStop]);
    

    return (
        <div className="bg-white z-20 absolute top-20 left-10 p-4 shadow-lg rounded-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Scheduled Buses</h2>
            {scheduledBuses.length > 0 ? (
                <div className="space-y-4">
                    {scheduledBuses.map((bus) => (
                        <div key={bus._id} className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg">{bus.bus.name}</h3>
                                <span className={`text-sm py-1 px-3 rounded-full ${bus.status === 'Scheduled' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {bus.status}
                                </span>
                            </div>
                            <div className='flex space-x-1 items-center text-purple-700'><Icon icon={'ic:baseline-route'} /> <strong>Route:</strong></div>
                            <p className='text-gray-700'>{bus.route.routeName}</p>
                            <div className='flex space-x-1 items-center text-purple-700 mt-5'><Icon icon={'subway:time-2'} className='size-3' /> <strong>Scheduled Time:</strong></div>
                            <p>
                                {new Date(bus.scheduleTime)
                                    .toLocaleDateString('en-GB') // Formats the date as dd/mm/yyyy
                                    .replace(/\//g, '-')}
                                {' '}
                                {new Date(bus.scheduleTime)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  {/* You can customize the time format as well */}
                            </p>

                        </div>
                    ))}
                </div>
            ) : (
                <p>No buses scheduled for this bus stop.</p>
            )}
        </div>
    );
};

export default LeftSidePanel;
