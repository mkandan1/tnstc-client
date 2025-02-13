import React, { createContext, useState, useContext, useEffect } from 'react';
import getPlatformStatus from '../services/maintenance.service';

const MaintenanceContext = createContext();

export const useMaintenance = () => {
    return useContext(MaintenanceContext);
};

export const MaintenanceProvider = ({ children }) => {
    const [maintenance, setMaintenance] = useState(false);
    const [statusChecked, setStatusChecked] = useState(false);

    const fetchMaintenanceStatus = async () => {
        try {
        } catch (error) {
            console.error('Failed to fetch platform status:', error);
        }
        finally {
            setStatusChecked(true)
        }
    };

    useEffect(() => {
        fetchMaintenanceStatus();
    }, []);

    return (
        <MaintenanceContext.Provider value={{ maintenance, statusChecked, setMaintenance }}>
            {children}
        </MaintenanceContext.Provider>
    );
};
