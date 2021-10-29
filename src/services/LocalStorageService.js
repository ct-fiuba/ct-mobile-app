import AsyncStorage from '@react-native-async-storage/async-storage';

export const SCAN_WINDOW = 14;

export const saveSession = session =>
  AsyncStorage.setItem('session', JSON.stringify(session));

export const removeSession = () => AsyncStorage.removeItem('session');

export const getSessionActive = () => AsyncStorage.getItem('session');

export const getAccessToken = async () => {
  const session = await getSessionActive();
  if (session) {
    const { accessToken } = JSON.parse(session);
    return accessToken;
  }
  return null;
};

export const saveUserInfo = info => {
  AsyncStorage.setItem('ct-user', JSON.stringify(info));
};

export const getUserInfo = async () => {
  const data = await AsyncStorage.getItem('ct-user');
  return data ? JSON.parse(data) : {};
};

export const saveScan = scan => {
  const keyDate = scan.entranceTimestamp.toISOString().slice(0, 10);
  AsyncStorage.getItem(keyDate).then(scans => {
    const scansParsed = scans ? JSON.parse(scans) : [];
    scansParsed.push(scan);
    AsyncStorage.setItem(keyDate, JSON.stringify(scansParsed));
  });
  AsyncStorage.setItem('ct-last-visit', JSON.stringify(scan));
};

export const getCodes = async () => {
  let codes = [];
  let date;
  for (let i = 0; i < SCAN_WINDOW; i++) {
    date = new Date();
    date.setDate(date.getDate() - i);

    const keyDate = date.toISOString().slice(0, 10);

    const scans = await AsyncStorage.getItem(keyDate);
    const scansParsed = scans ? JSON.parse(scans) : [];
    codes = [...codes, ...scansParsed];
  }

  return codes;
};

export const saveRisk = risk => AsyncStorage.setItem('ct-risk', risk);

export const getRisk = () => AsyncStorage.getItem('ct-risk');

export const getLastVisit = async () => {
  const lastVisit = await AsyncStorage.getItem('ct-last-visit');
  return JSON.parse(lastVisit);
};

export const clearLastVisitInfo = async () => {
  await AsyncStorage.setItem('ct-last-visit', '');
};

export const setInfected = infected => {
  AsyncStorage.setItem('ct-infected', `${infected}`);
};

export const getInfected = async () => {
  const infected = await AsyncStorage.getItem('ct-infected');
  return infected === 'true';
};
