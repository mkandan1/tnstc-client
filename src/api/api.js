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

  if (!token && location !== "/") {
    await getNewAccessToken();
    token = getAccessToken();
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  const response = await apiClient.request({
    method,
    url,
    data,
    headers,
  });

  return response.data;
};


export const get = (url) => apiRequest('GET', url);
export const post = (url, data, isMultipart = false) => apiRequest('POST', url, data, isMultipart);
export const put = (url, data) => apiRequest('PUT', url, preprocessData(data));
export const del = (url) => apiRequest('DELETE', url, {});
