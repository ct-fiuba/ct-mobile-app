import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { withGenuxToken } from './CTAuthServerService';
import { saveScan, getUserInfo, getLastVisit, clearLastVisitInfo } from './LocalStorageService';
import { saveVisit, addExitTimestamp } from './CTUserAPIService';

const EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER = 3;

export const scan = async (scanCode, isExit, estimatedVisitDuration) => {
  if (!isExit) {
    return scanEntrance(scanCode, estimatedVisitDuration);
  }
  return scanExit(scanCode, estimatedVisitDuration);
};

const scanEntrance = async (scanCode, estimatedVisitDuration) => {
  const entranceTimestamp = new Date();
  const userInfo = await getUserInfo();
  const value = {
    scanCode,
    entranceTimestamp,
    userGeneratedCode: uuidv4(),
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
      console.log(res);
      saveScan(value);
      return res;
    })
    .catch(error => error.response);
};

const scanExit = async (scanCode, estimatedVisitDuration) => {
  const exitTimestamp = new Date();
  const userInfo = await getUserInfo();
  const lastVisit = await getLastVisit();
  const closingPreviousVisit = isExitScanClosingPreviousVisit(lastVisit, scanCode, estimatedVisitDuration);
  const value = {
    scanCode,
    exitTimestamp,
    userGeneratedCode: closingPreviousVisit ? lastVisit.userGeneratedCode : uuidv4(),
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
  return withGenuxToken(addExitTimestamp(value))
    .then(res => {
      if (closingPreviousVisit) {
        clearLastVisitInfo();
      } else {
        saveScan(value);
      }
      return res;
    })
    .catch(error => error.response);
};

const isExitScanClosingPreviousVisit = (lastVisit, scanCode, estimatedVisitDuration) => {
  if (!lastVisit || lastVisit.scanCode !== scanCode) {
    return false;
  }
  const minutesDifference = msToMinutes(new Date() - new Date(lastVisit.entranceTimestamp));
  const maximumDifference = parseInt(estimatedVisitDuration) * EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER;
  return minutesDifference <= maximumDifference;
}

const msToMinutes = (ms) => {
  return Math.floor(ms / 1000 / 60);
}
