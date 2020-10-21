import { AsyncStorage } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const saveSession = session =>
  AsyncStorage.setItem('session', JSON.stringify(session));

export const removeSession = () => AsyncStorage.removeItem('session');

export const getSessionActive = () => AsyncStorage.getItem('session');

export const getAccessToken = async () => {
  const session = await getSessionActive();
  const { accessToken } = JSON.parse(session);
  return accessToken;
};

export const saveScan = async scanCode => {
  const timestamp = new Date();
  const keyDate = timestamp.toISOString().slice(0, 10);
  const value = {
    code: scanCode,
    timestamp,
    id: uuidv4(),
  };
  AsyncStorage.getItem(keyDate).then(scans => {
    const scansParsed = scans ? JSON.parse(scans) : [];
    scansParsed.push(value);
    AsyncStorage.setItem(keyDate, JSON.stringify(scansParsed));
  });
};
