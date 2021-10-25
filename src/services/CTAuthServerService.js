import axios from 'axios';

import { CT_AUTH_SERVER_URI } from 'react-native-dotenv';
import { openAlert } from '../utils/alert';

import {
  getAccessToken,
  getSessionActive,
  saveSession,
  removeSession,
} from './LocalStorageService';

const authApi = axios.create({
  baseURL: CT_AUTH_SERVER_URI,
});

export const signIn = (email, password) =>
  authApi.post('/users/login', { email, password });

export const signUp = (email, dni, password) =>
  authApi.post('/users/signUp', { email, DNI: dni, password });

export const refreshAccessToken = refreshToken =>
  authApi.post('/refreshToken', { refreshToken });

export const withGenuxToken = async request => {
  const accessToken = await getAccessToken();
  return authApi
    .post('/generateGenuxToken', { accessToken })
    .then(response => {
      const { genuxToken } = response.data;
      return request(genuxToken);
    })
    .catch(error => error.response);
};

authApi.interceptors.response.use(null, async error => {
  if (error.config && error.response && error.response.status === 401) {
    const session = await getSessionActive();
    const parsedSession = JSON.parse(session);
    return refreshAccessToken(parsedSession.refreshToken)
      .then(refreshResponse => {
        saveSession({ ...parsedSession, ...refreshResponse.data });
        error.config.data.accessToken = refreshResponse.data.accessToken;
        return authApi.request(error.config);
      })
      .catch(async error => {
        await removeSession();
        openAlert('Sesión expirada');
        return Promise.reject(new Error('Sesión expirada'));
      });
  }

  return Promise.reject(error);
});
