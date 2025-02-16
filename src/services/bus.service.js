import { get, post, put, del } from "../api/api";

const busService = {
    getAllBuses: async () => {
        try {
            return await get('/buses/');
        } catch (error) {
            console.error('Error fetching buses:', error.message);
            throw error;
        }
    },

    getBusById: async (busId) => {
        try {
            return await get(`/buses/${busId}`);
        } catch (error) {
            console.error(`Error fetching bus with ID ${busId}:`, error.message);
            throw error;
        }
    },

    createBus: async (busData) => {
        try {
            return await post('/buses', busData);
        } catch (error) {
            console.error('Error creating bus:', error.message);
            throw error;
        }
    },

    updateBus: async (busId, busData) => {
        try {
            return await put(`/buses/${busId}`, busData);
        } catch (error) {
            console.error(`Error updating bus with ID ${busId}:`, error.message);
            throw error;
        }
    },

    deleteBus: async (busId) => {
        try {
            return await del(`/buses/${busId}`);
        } catch (error) {
            console.error(`Error deleting bus with ID ${busId}:`, error.message);
            throw error;
        }
    },
};

export default busService;