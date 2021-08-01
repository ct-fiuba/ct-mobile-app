import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { withGenuxToken } from './CTAuthServerService';
import { saveScan, getUserInfo } from './LocalStorageService';
import { saveVisit } from './CTUserAPIService';

export const scan = async (scanCode, isExit) => {
  const timestamp = new Date();
  const userInfo = await getUserInfo();
  const value = {
    scanCode,
    timestamp,
    userGeneratedCode: uuidv4(),
    isExitScan: isExit,
    ...(userInfo && {
      vaccinated: userInfo.vaccinated ? userInfo.dose : 0,
      ...(userInfo.vaccinated && {
        vaccineReceived: userInfo.vaccine.name, // TODO: Maybe is better to send the id
        vaccinatedDate: userInfo.lastDoseDate,
      }),
      covidRecovered: userInfo.beenInfected,
      ...(userInfo.beenInfected && {
        covidRecoveredDate: userInfo.medicalDischargeDate,
      }),
    }),
  };
  return withGenuxToken(saveVisit(value))
    .then(res => {
      saveScan(value);
      return res;
    })
    .catch(error => error.response);
};
