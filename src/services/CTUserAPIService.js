import { CT_USER_API_URI } from 'react-native-dotenv';

import axios from 'axios';
import {
  getSessionActive,
  saveSession,
  SCAN_WINDOW,
  removeSession,
} from './LocalStorageService';
import { refreshAccessToken, withGenuxToken } from './CTAuthServerService';

const userApi = axios.create({
  baseURL: CT_USER_API_URI,
});

userApi.interceptors.response.use(null, async error => {
  if (error.config && error.response && error.response.status === 401) {
    const session = await getSessionActive();
    return refreshAccessToken(JSON.parse(session).refreshToken)
      .then(refreshResponse => {
        saveSession(refreshResponse.data);
        error.config.headers['access-token'] = refreshResponse.data.accessToken;
        return userApi.request(error.config);
      })
      .catch(async error => {
        console.error('REFRESH ERRORED', error);
        await removeSession();
        return Promise.reject(new Error('Sesión expirada'));
      });
  }

  return Promise.reject(error);
});

export const setAccessToken = accessToken =>
  (userApi.defaults.headers.common['access-token'] = accessToken);

export const saveVisit = visitInfo => async genuxToken =>
  userApi.post('/visits', visitInfo, {
    headers: { 'genux-token': genuxToken },
  });

export const addExitTimestamp = visitInfo => async genuxToken =>
  userApi.post('/visits/addExitTimestamp', visitInfo, {
    headers: { 'genux-token': genuxToken },
  });

export const sendCodes = codes =>
  Promise.all(
    codes.map(code =>
      withGenuxToken(genuxToken =>
        userApi.post(
          '/infected',
          { userGeneratedCode: code.userGeneratedCode },
          {
            headers: { 'genux-token': genuxToken },
          }
        )
      )
    )
  );

export const getBillboard = async () => {
  const date = new Date();
  date.setDate(date.getDate() - SCAN_WINDOW);
  const keyDate = date.toISOString().slice(0, 10);
  return userApi.get(`/billboard?from=${keyDate}`).then(res => res.data);
};
