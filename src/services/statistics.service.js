import { get } from "../api/api";

const statisticsService = {
    getStatistics: async () => {
        try {
            const response = await get('/statistics');
            return response;
        } catch (error) {
            console.error('Error fetching bus stops:', error.message);
            throw error;
        }
    }
}

export default statisticsService