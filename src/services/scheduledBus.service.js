import {get, post, del, put} from "../api/api";

const BASE_URL = "/scheduled-buses"; // API endpoint for scheduled buses

const scheduledBusService = {
  /**
   * Fetch all scheduled buses
   * @returns {Promise}
   */
  getAllScheduledBuses: async () => {
    try {
      const response = await get(BASE_URL);
      return response;
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
};

export default scheduledBusService;