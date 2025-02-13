import {get, post, put, del} from '../api/api'; // Assuming `api` is a pre-configured Axios instance

const driverService = {
    /**
     * Fetch all drivers
     * @returns {Promise<Array>} List of drivers
     */
    getAllDrivers: async () => {
        try {
            const response = await get('/drivers');
            return response;
        } catch (error) {
            console.error('Error fetching drivers:', error.message);
            throw error;
        }
    },

    /**
     * Fetch a single driver by ID
     * @param {string} driverId - Driver ID
     * @returns {Promise<Object>} Driver data
     */
    getDriverById: async (driverId) => {
        try {
            const response = await get(`/drivers/${driverId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching driver with ID ${driverId}:`, error.message);
            throw error;
        }
    },

    /**
     * Create a new driver
     * @param {Object} driverData - New driver data
     * @returns {Promise<Object>} Created driver data
     */
    createDriver: async (driverData) => {
        try {
            const response = await post('/drivers', driverData);
            return response;
        } catch (error) {
            console.error('Error creating driver:', error.message);
            throw error;
        }
    },

    /**
     * Update a driver by ID
     * @param {string} driverId - Driver ID
     * @param {Object} driverData - Updated driver data
     * @returns {Promise<Object>} Updated driver data
     */
    updateDriver: async (driverId, driverData) => {
        try {
            const response = await put(`/drivers/${driverId}`, driverData);
            return response;
        } catch (error) {
            console.error(`Error updating driver with ID ${driverId}:`, error.message);
            throw error;
        }
    },

    /**
     * Delete a driver by ID
     * @param {string} driverId - Driver ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteDriver: async (driverId) => {
        try {
            const response = await del(`/drivers/${driverId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting driver with ID ${driverId}:`, error.message);
            throw error;
        }
    },
};

export default driverService;
