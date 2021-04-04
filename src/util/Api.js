import axios from 'axios';

require('dotenv').config();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(async (request) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    request.headers.Authorization = `Bearer ${token}`;
  }
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
      reject(error.response ?? error);
    });
  },
);

export default api;
