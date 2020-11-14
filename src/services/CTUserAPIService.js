import { create } from 'apisauce';

import { CT_USER_API_URI } from 'react-native-dotenv';

const userApi = create({
  baseURL: CT_USER_API_URI,
});

export const setAccessToken = accessToken =>
  userApi.setHeader('access-token', accessToken);

export const saveVisit = visitInfo => async genuxToken => {
  const response = await userApi.post('/visits', visitInfo, {
    headers: { 'genux-token': genuxToken },
  });
  console.log('ACA RESPONSE ES', response);
  return response;
};
