import axios from 'axios';
import { GetTokenFromCookie } from './functions';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/graphql',
});

const tratarErro = (response) => {
  const retorno = { data: null, error: null, extensions: null };
    
  try {  
    if (response.data && response.status !== 500) {
      if (response.data.errors) {
        retorno.error = response.data.errors;
      }
      if (response.data.extensions) {
        retorno.extensions = response.data.extensions;
      }
      if (retorno.error) {
        retorno.error = retorno.error[0].message;
      }
      if (response.data.data && !retorno.error) {
        retorno.data = response.data.data;
        retorno.error = null;
      }
    } else {
      retorno.error = 'Não foi possível se comunicar com o Servidor!';
    }
  } catch (error) {
    retorno.error = error.message;
  }

  return retorno;
}

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
    response.data = tratarErro(response);
    return new Promise((resolve) => {
      resolve(response);
    });
  },
  async (error) => {
    return new Promise((reject) => {
      if (error.response && error.response.data) {
        error.response.data = tratarErro(error.response)
      }
      reject(error.response || error);
    });
  },
);

export default api;