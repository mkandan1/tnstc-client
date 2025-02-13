import { get, post, put, del } from '../api/api';

const routeService = {
  /**
   * Fetch all routes
   * @returns {Promise<Array>} List of routes
   */
  getAllRoutes: async () => {
    try {
      const response = await get('/routes');
      return response;
    } catch (error) {
      console.error('Error fetching routes:', error.message);
      throw error;
    }
  },

  /**
   * Fetch a single route by ID
   * @param {string} routeId - Route ID
   * @returns {Promise<Object>} Route data
   */
  getRouteById: async (routeId) => {
    try {
      const response = await get(`/routes/${routeId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching route with ID ${routeId}:`, error.message);
      throw error;
    }
  },

  /**
   * Create a new route
   * @param {Object} routeData - New route data
   * @returns {Promise<Object>} Created route data
   */
  createRoute: async (routeData) => {
    try {
      const response = await post('/routes', routeData);
      return response;
    } catch (error) {
      console.error('Error creating route:', error.message);
      throw error;
    }
  },

  /**
   * Update a route by ID
   * @param {string} routeId - Route ID
   * @param {Object} routeData - Updated route data
   * @returns {Promise<Object>} Updated route data
   */
  updateRoute: async (routeId, routeData) => {
    try {
      const response = await put(`/routes/${routeId}`, routeData);
      return response;
    } catch (error) {
      console.error(`Error updating route with ID ${routeId}:`, error.message);
      throw error;
    }
  },

  /**
   * Delete a route by ID
   * @param {string} routeId - Route ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteRoute: async (routeId) => {
    try {
      const response = await del(`/routes/${routeId}`);
      return response;
    } catch (error) {
      console.error(`Error deleting route with ID ${routeId}:`, error.message);
      throw error;
    }
  },
};

export default routeService;
