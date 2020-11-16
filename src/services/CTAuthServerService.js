import axios from 'axios';

import { CT_AUTH_SERVER_URI } from 'react-native-dotenv';

import {
  getAccessToken,
  getSessionActive,
  saveSession,
} from './LocalStorageService';

const authApi = axios.create({
  baseURL: CT_AUTH_SERVER_URI,
});

export const signIn = (email, password) =>
  authApi.post('/signIn', { email, password });

export const signUp = (email, dni, password) =>
  authApi.post('/signUp', { email, DNI: dni, password });

export const refreshAccessToken = refreshToken =>
  authApi.post('/refreshToken', { refreshToken });

export const withGenuxToken = async request => {
  const accessToken = await getAccessToken();
  return authApi.post('/generateGenuxToken', { accessToken }).then(response => {
    const { genuxToken } = response.data;
    return request(genuxToken);
  });
};

authApi.interceptors.response.use(null, async error => {
  if (error.config && error.response && error.response.status === 401) {
    const session = await getSessionActive();

    return refreshAccessToken(JSON.parse(session).refreshToken)
      .then(refreshResponse => {
        saveSession(refreshResponse.data);
        error.config.data = {
          ...error.config.data,
          accessToken: refreshResponse.data.accessToken,
        };
        console.log(error.config);
        return authApi.request(error.config);
      })
      .catch(refreshError => Promise.reject(refreshError));
  }

  return Promise.reject(error);
});
