import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

api.interceptors.response.use(
  async (response) =>
    new Promise((resolve) => {
      resolve(response);
    }),
  async (error) =>
    new Promise((reject) => {
      reject(error.response ?? error);
    }),
);

module.exports = api;
