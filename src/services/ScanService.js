import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { withGenuxToken } from './CTAuthServerService';
import { saveScan, getUserInfo, getLastVisit, clearLastVisitInfo } from './LocalStorageService';
import { saveVisit, addExitTimestamp } from './CTUserAPIService';

const EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER = 3;
const NEW_SCAN_CLOSING_LAST_VISIT_WINDOW_MULTIPLIER = 2;

export const scan = async (scanCode, isExit, estimatedVisitDuration) => {
  if (!isExit) {
    return scanEntrance(scanCode, estimatedVisitDuration);
  }
  return scanExit(scanCode, estimatedVisitDuration);
};

const scanEntrance = async (scanCode, estimatedVisitDuration) => {
  const entranceTimestamp = new Date();
  const userInfo = await getUserInfo();
  const lastVisit = await getLastVisit();
  // if the we have a last visit we need to evaluate if we need to close it
  if (lastVisit) {
    await addExitTimestampToLastVisit(lastVisit);
  }
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
      value['estimatedVisitDuration'] = estimatedVisitDuration;
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

  // if the we have a last visit but the current exit QR is not closing it, we need to evaluate if we need to close the previous visit
  if (lastVisit && !closingPreviousVisit) {
    await addExitTimestampToLastVisit(lastVisit);
  }

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
        value['estimatedVisitDuration'] = estimatedVisitDuration;
        saveScan(value);
      }
      return res;
    })
    .catch(error => error.response);
};

const addExitTimestampToLastVisit = async (lastVisit) => {
  if (!isPreviousVisitStillClosable(lastVisit)) {
    clearLastVisitInfo();
    return;
  }
  const exitTimestamp = new Date();
  const value = {
    scanCode: lastVisit.scanCode,
    exitTimestamp,
    userGeneratedCode: lastVisit.userGeneratedCode,
  };
  return withGenuxToken(addExitTimestamp(value))
    .then(res => {
      clearLastVisitInfo();
      return res;
    })
    .catch(error => error.response);
}

const isExitScanClosingPreviousVisit = (lastVisit, scanCode, estimatedVisitDuration) => {
  if (!lastVisit || lastVisit.scanCode !== scanCode) {
    return false;
  }
  const minutesDifference = msToMinutes(new Date() - new Date(lastVisit.entranceTimestamp));
  const maximumDifference = parseInt(estimatedVisitDuration) * EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER;
  return minutesDifference <= maximumDifference;
}

const isPreviousVisitStillClosable = (lastVisit) => {
  const minutesDifference = msToMinutes(new Date() - new Date(lastVisit.entranceTimestamp));
  const maximumDifference = parseInt(lastVisit.estimatedVisitDuration) * NEW_SCAN_CLOSING_LAST_VISIT_WINDOW_MULTIPLIER;
  return minutesDifference <= maximumDifference;
}

const msToMinutes = (ms) => {
  return Math.floor(ms / 1000 / 60);
}
