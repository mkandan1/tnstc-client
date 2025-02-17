import axios from "axios";
import { delayedNavigation } from "../util/navigate";
import toast from "react-hot-toast";
import { getNewAccessToken } from "../services/user.service";

axios.defaults.withCredentials = true;
const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1/`,
    timeout: 18000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
        if (!error.response) {
            console.error("Network Error:", error.message);
        } else {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    toast.error(data.message || "Bad Request. Please check your input.");
                    break;
                case 403:
                    toast.error("Forbidden. You don't have permission to perform this action.");
                    delayedNavigation('/login', 1000)
                    break;
                case 404:
                    toast.error(data.message || "Resource not found.");
                    break;
                case 500:
                    toast.error("Internal Server Error. Please try again later.");
                    break;
                default:
                    toast.error("An unexpected error occurred. Please try again.");
            }
            console.error("API Error:", status, data);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
