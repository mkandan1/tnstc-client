import { get, post, put, del } from "../api/api";

const BASE_URL = "/users";

const driverService = {
  /**
   * Fetch all drivers
   * @returns {Promise}
   */
  getAllDrivers: async () => {
    try {
      const response = await get(`${BASE_URL}?role=driver`); // Fetch only drivers
      return response.results;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Fetch a driver by ID
   * @param {string} id - Driver ID
   * @returns {Promise}
   */
  getDriverById: async (id) => {
    try {
      const response = await get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

};

export default driverService;
