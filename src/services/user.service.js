import apiClient from "../api/config";
import { setUser } from "../redux/userSlice";
import { get, post, put, del } from '../api/api'; // Assuming `api` is a pre-configured Axios instance

const userService = {
    /**
     * Fetch all users
     * @returns {Promise<Array>} List of users
     */
    getAllUsers: async () => {
        try {
            const response = await get('/users');
            return response;
        } catch (error) {
            console.error('Error fetching users:', error.message);
            throw error;
        }
    },

    /**
     * Fetch a single user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User data
     */
    getUserById: async (userId) => {
        try {
            const response = await get(`/users/${userId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error.message);
            throw error;
        }
    },

    /**
     * Create a new user
     * @param {Object} userData - New user data (Driver, Manager, Admin, etc.)
     * @returns {Promise<Object>} Created user data
     */
    createUser: async (userData) => {
        try {
            const response = await post('/auth', userData);
            return response;
        } catch (error) {
            console.error('Error creating user:', error.message);
            throw error;
        }
    },

    /**
     * Update a user by ID
     * @param {string} userId - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object>} Updated user data
     */
    updateUser: async (userId, userData) => {
        try {
            const response = await put(`/users/${userId}`, userData);
            return response;
        } catch (error) {
            console.error(`Error updating user with ID ${userId}:`, error.message);
            throw error;
        }
    },

    /**
     * Delete a user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteUser: async (userId) => {
        try {
            const response = await del(`/users/${userId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error.message);
            throw error;
        }
    },

    currentUser: async () => {
        try {
            const response = await get('/auth/currentUser');
            return response.user
        } catch (error) {
            console.error(`Error getting user data: `, error.message)
            throw error
        }
    }
};

const getNewAccessToken = async () => {
    try {
        const { token } = await apiClient.get('/auth/refresh-tokens');
        if (token) {
            document.cookie = `x-token=${token}; path='/';`;
        }
    } catch (error) {
        if (error.response && error.response.status === 401 && window.location.pathname !== "/login" && window.location.pathname !== "/") {
            console.log('Session expired! Please log in again.')
            window.location.href = "/login"
        }
        console.error("Failed to refresh token:", error.message);
        throw error;
    }
};


const getAccessToken = () => {
    const token = document.cookie
        .split(';')
        .find(row => row.startsWith('x-token'))?.split('=')[1];
    return token || null;
};


const authendicateAndFetchUser = async (dispatch) => {
    if (window.location.pathname === '/login') {
        return;
    }
    try {
        const currentUser = await get('/auth/currentUser');
        dispatch(setUser(currentUser));
    } catch (error) {
        throw new Error("Unexpected error while fetching user data.");
    }
};

export {
    getAccessToken,
    getNewAccessToken,
    authendicateAndFetchUser,
    userService
};
