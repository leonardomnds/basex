import axios from 'axios';

const api = axios.create({
  baseURL: '/api/graphql',
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
