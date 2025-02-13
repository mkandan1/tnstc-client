import { get } from "../api/api"

const getPlatformStatus = async () => {
    const response = await get('/maintenance/status');
    return response.maintenance;
}

export default getPlatformStatus;