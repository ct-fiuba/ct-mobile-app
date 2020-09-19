import { create } from 'apisauce';

import { CT_AUTH_SERVER_URI } from 'react-native-dotenv';

const authApi = create({
  baseURL: CT_AUTH_SERVER_URI,
});

export const signIn = (email, password) =>
  authApi.post('/signIn', { email, password });

export const signUp = (email, password) =>
  authApi.post('/signUp', { email, password });
