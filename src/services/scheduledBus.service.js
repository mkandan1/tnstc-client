import { del, get, post, put } from "../api/api";

const BASE_URL = "/scheduled-buses"; // API endpoint for scheduled buses

export const scheduledBusService = {
  /**
   * Fetch all scheduled buses
   * @returns {Promise}
   */
  getAllScheduledBuses: async ({ driverId, busStop, status }) => {
    try {
      let url = BASE_URL;
      const queryParams = [];
      
      if (driverId) {
        queryParams.push(`driver=${driverId}`);
      }
      
      if (busStop) {
        queryParams.push(`busStop=${busStop}`);
      }

      if (busStop) {
        queryParams.push(`status=${status}`);
      }
  
      // Add the query params to the URL if available
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
  
      const response = await get(url);
      if(response.results){
        return response.results;
      }
      else {
        
      return response
      }
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },  

  /**
   * Fetch a scheduled bus by ID
   * @param {string} id - ScheduledBus ID
   * @returns {Promise}
   */
  getScheduledBusById: async (id) => {
    try {
      const response = await get(`${BASE_URL}/${id}`);
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Create a new scheduled bus
   * @param {object} scheduledBusData - Data for new scheduled bus
   * @returns {Promise}
   */
  createScheduledBus: async (scheduledBusData) => {
    try {
      const response = await post(BASE_URL, scheduledBusData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Update an existing scheduled bus
   * @param {string} id - ScheduledBus ID
   * @param {object} scheduledBusData - Updated data
   * @returns {Promise}
   */
  updateScheduledBus: async (id, scheduledBusData) => {
    try {
      const response = await put(`${BASE_URL}/${id}`, scheduledBusData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Delete a scheduled bus by ID
   * @param {string} id - ScheduledBus ID
   * @returns {Promise}
   */
  deleteScheduledBus: async (id) => {
    try {
      const response = await del(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Start the ride and update location
   * @param {string} id - ScheduledBus ID
   * @param {object} location - { latitude, longitude }
   * @returns {Promise}
   */
  startRide: async (id, location) => {
    try {
      const response = await put(`${BASE_URL}/${id}/start-ride`, location);
      return response; 
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  completeRide: async (id) => {
    try{
      const response = await put(`${BASE_URL}/${id}/complete-ride`);
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Update the bus location
   * @param {string} id - ScheduledBus ID
   * @param {object} location - { latitude, longitude }
   * @returns {Promise}
   */
  updateBusLocation: async (id, location) => {
    try {
      const response = await put(`${BASE_URL}/update-location/${id}`, location);
      return response; // The response will contain the updated location
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};
