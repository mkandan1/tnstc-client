import { get } from "../api/api";
import apiClient from "../api/config";
import { setUser } from "../redux/userSlice";

const getNewAccessToken = async () => {
    try {
        const { token } = await apiClient.get('/auth/refresh-tokens');
        if (token) {
            document.cookie = `x-token=${token}; path='/';`;
        }
    } catch (error) {
        if (error.response && error.response.status === 401 && window.location.pathname !== "/login") {
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
};
