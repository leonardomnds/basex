import axios from 'axios';
import { GetTokenFromCookie } from './functions';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (request) => {
  try {
    const token = GetTokenFromCookie();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }    
  } catch (err) {}
  return request;
});

api.interceptors.response.use(
  async (response) => {
    return new Promise((resolve) => {
      resolve(response);
    });
  },
  async (error) => {
    return new Promise((reject) => {
      reject(error.response || error);
    });
  },
);

export default api;