import { AsyncStorage } from 'react-native';

export const saveSession = session =>
  AsyncStorage.setItem('session', JSON.stringify(session));

export const removeSession = () => AsyncStorage.removeItem('session');

export const getSessionActive = () => AsyncStorage.getItem('session');

export const getAccessToken = async () => {
  const session = await getSessionActive();
  const { accessToken } = JSON.parse(session);
  return accessToken;
};

export const saveScan = scan => {
  const keyDate = scan.timestamp.toISOString().slice(0, 10);
  AsyncStorage.getItem(keyDate).then(scans => {
    const scansParsed = scans ? JSON.parse(scans) : [];
    scansParsed.push(scan);
    AsyncStorage.setItem(keyDate, JSON.stringify(scansParsed));
  });
};
