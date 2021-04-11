import axios from 'axios';

const api = axios.create({
  baseURL: '',
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