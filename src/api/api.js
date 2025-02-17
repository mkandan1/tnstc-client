import toast from 'react-hot-toast';
import { getAccessToken, getNewAccessToken } from '../services/user.service';
import apiClient from './config';

const preprocessData = (data) => {
  if (data && typeof data === 'object') {
    const { __v, _id, createdAt, updatedAt, ...cleanedData } = data;
    return cleanedData;
  }
  return data;
};

const apiRequest = async (method, url, data, isMultipart = false) => {
  const location = window.location.pathname;
  let token = getAccessToken();

  if (!token && location != "/") {
    await getNewAccessToken();
    token = getAccessToken();
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
  };

  // 🔹 Ensure `data` is never null, default to empty object `{}`.
  const processedData = data ? preprocessData(data) : {};

  const response = await apiClient.request({
    method,
    url,
    data: processedData, // ✅ Fixed: `null` replaced with `{}`.
    headers,
  });

  return response.data;
};


export const get = (url) => apiRequest('GET', url);
export const post = (url, data, isMultipart = false) => apiRequest('POST', url, preprocessData(data), isMultipart);
export const put = (url, data) => apiRequest('PUT', url, preprocessData(data));
export const del = (url) => apiRequest('DELETE', url, {});
