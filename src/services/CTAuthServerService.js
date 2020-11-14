import { create } from 'apisauce';

import { CT_AUTH_SERVER_URI } from 'react-native-dotenv';

import { getAccessToken } from './LocalStorageService';

const authApi = create({
  baseURL: CT_AUTH_SERVER_URI,
});

export const signIn = (email, password) =>
  authApi.post('/signIn', { email, password });

export const signUp = (email, dni, password) =>
  authApi.post('/signUp', { email, DNI: dni, password });

export const withGenuxToken = async request => {
  const accessToken = await getAccessToken();
  const response = await authApi.post('/generateGenuxToken', { accessToken });
  if (response.ok) {
    const { genuxToken } = response.data;
    return request(genuxToken);
  }
  return response;
};
