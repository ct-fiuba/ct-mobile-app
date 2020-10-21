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

export const getuuid = () =>
  // mejorar
  Math.random()
    .toString(36)
    .substring(2) + Date.now().toString(36);

export const saveScan = async scanCode => {
  const keyDate = new Date().toISOString().slice(0, 10);
  const value = {
    code: scanCode,
    timestamp: new Date(),
    id: getuuid(),
  };
  AsyncStorage.getItem(keyDate).then(scans => {
    console.log(scans);
    const scansParsed = scans ? JSON.parse(scans) : [];
    scansParsed.push(value);
    AsyncStorage.setItem(keyDate, JSON.stringify(scansParsed));
  });
};
