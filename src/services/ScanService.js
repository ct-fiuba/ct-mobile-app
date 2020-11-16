import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { withGenuxToken } from './CTAuthServerService';
import { saveScan } from './LocalStorageService';
import { saveVisit } from './CTUserAPIService';

export const scan = async scanCode => {
  const timestamp = new Date();
  const value = {
    scanCode,
    timestamp,
    userGeneratedCode: uuidv4(),
  };
  return withGenuxToken(saveVisit(value))
    .then(res => {
      saveScan(value);
      return res;
    })
    .catch(error => error.response);
};
