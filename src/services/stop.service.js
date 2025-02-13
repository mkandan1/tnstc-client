import { get, post, put, del } from '../api/api'; // Assuming `api` is a pre-configured Axios instance

const busStopService = {
    getAllBusStops: async () => {
        try {
            const response = await get('/bus-stops');
            return response;
        } catch (error) {
            console.error('Error fetching bus stops:', error.message);
            throw error;
        }
    },

    getBusStopById: async (busStopId) => {
        try {
            const response = await get(`/bus-stops/${busStopId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching bus stop with ID ${busStopId}:`, error.message);
            throw error;
        }
    },

    createBusStop: async (busStopData) => {
        try {
            const response = await post('/bus-stops', busStopData);
            return response;
        } catch (error) {
            console.error('Error creating bus stop:', error.message);
            throw error;
        }
    },

    updateBusStop: async (busStopId, busStopData) => {
        try {
            const response = await put(`/bus-stops/${busStopId}`, busStopData);
            return response;
        } catch (error) {
            console.error(`Error updating bus stop with ID ${busStopId}:`, error.message);
            throw error;
        }
    },

    deleteBusStop: async (busStopId) => {
        try {
            const response = await del(`/bus-stops/${busStopId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting bus stop with ID ${busStopId}:`, error.message);
            throw error;
        }
    },
};

export default busStopService;
