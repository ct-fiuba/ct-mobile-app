import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { withGenuxToken } from './CTAuthServerService';
import {
  saveScan,
  getUserInfo,
  getLastVisit,
  clearLastVisitInfo,
} from './LocalStorageService';
import { saveVisit, addExitTimestamp } from './CTUserAPIService';

import { msToMinutes } from '../utils/dateFormat';

const EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER = 3;
const NEW_SCAN_CLOSING_LAST_VISIT_WINDOW_MULTIPLIER = 2;

// Check if the last visit is under the time window where it is still closable, and if it has the same spaceId as the exit QR code recently scanned
export const isExitScanClosingLastVisit = (lastVisit, spaceId) => {
  if (!lastVisit || lastVisit.spaceId !== spaceId) {
    return false;
  }
  const minutesDifference = msToMinutes(
    new Date() - new Date(lastVisit.entranceTimestamp)
  );
  const maximumDifference =
    parseInt(lastVisit.estimatedVisitDuration) *
    EXIT_SCAN_VISIT_DURATION_WINDOW_MULTIPLIER;
  return minutesDifference <= maximumDifference;
};

// Check if the last visit is under the time window where it is still closable
export const isLastVisitStillClosable = lastVisit => {
  const minutesDifference = msToMinutes(
    new Date() - new Date(lastVisit.entranceTimestamp)
  );
  const maximumDifference =
    parseInt(lastVisit.estimatedVisitDuration) *
    NEW_SCAN_CLOSING_LAST_VISIT_WINDOW_MULTIPLIER;
  return minutesDifference <= maximumDifference;
};

// Update the last visit exitTimestamp if it is still closable.
const addExitTimestampToLastVisit = async lastVisit => {
  if (!isLastVisitStillClosable(lastVisit)) {
    await clearLastVisitInfo();
    return;
  }
  const exitTimestamp = new Date();
  const value = {
    spaceId: lastVisit.spaceId,
    exitTimestamp,
    userGeneratedCode: lastVisit.userGeneratedCode,
  };
  return withGenuxToken(addExitTimestamp(value))
    .then(async res => {
      await clearLastVisitInfo();
      return res;
    })
    .catch(error => error.response);
};

// Function called when the QR code is an entrance code. Creates a new visit with the entrance QR code scanned. If there last visit is open and closable,
// it will update its exitTimestamp field.
const scanEntrance = async (spaceId, estimatedVisitDuration) => {
  const entranceTimestamp = new Date();
  const userInfo = await getUserInfo();
  const lastVisit = await getLastVisit();
  // if the we have a last visit we need to evaluate if we need to close it
  if (lastVisit) {
    await addExitTimestampToLastVisit(lastVisit);
  }
  const value = {
    spaceId: spaceId,
    entranceTimestamp,
    userGeneratedCode: uuidv4(),
    ...(userInfo && {
      vaccinated: userInfo.vaccinated ? userInfo.dose : 0,
      ...(userInfo.vaccinated && {
        vaccineReceived: userInfo.vaccine.name, // TODO: Maybe is better to send the id
        vaccinatedDate: userInfo.lastDoseDate,
      }),
      illnessRecovered: userInfo.beenInfected,
      ...(userInfo.beenInfected && {
        illnessRecoveredDate: userInfo.medicalDischargeDate,
      }),
    }),
  };
  return withGenuxToken(saveVisit(value))
    .then(res => {
      value.estimatedVisitDuration = estimatedVisitDuration;
      saveScan(value);
      return res;
    })
    .catch(error => error.response);
};

// Function called when the QR code is an exit code. It will check if the last visit the phone has stored
// is from the same place (same spaceId) and is still vigent (inside the time window where a visit is
// closable by its exit QR). If those conditions are satisfied, the corresponding visit is updated with
// the exitTimestamp. If not, a new visit is created, already closed, asuming the user didn't scan the
// entrance QR.
const scanExit = async (spaceId, estimatedVisitDuration) => {
  const exitTimestamp = new Date();
  const userInfo = await getUserInfo();
  const lastVisit = await getLastVisit();
  const closingLastVisit = isExitScanClosingLastVisit(lastVisit, spaceId);

  // if the we have a last visit but the current exit QR is not closing it, we need to evaluate if we need to close the previous visit
  if (lastVisit && !closingLastVisit) {
    await addExitTimestampToLastVisit(lastVisit);
  }

  const value = {
    spaceId: spaceId,
    exitTimestamp,
    userGeneratedCode: closingLastVisit
      ? lastVisit.userGeneratedCode
      : uuidv4(),
    ...(userInfo && {
      vaccinated: userInfo.vaccinated ? userInfo.dose : 0,
      ...(userInfo.vaccinated && {
        vaccineReceived: userInfo.vaccine.name, // TODO: Maybe is better to send the id
        vaccinatedDate: userInfo.lastDoseDate,
      }),
      illnessRecovered: userInfo.beenInfected,
      ...(userInfo.beenInfected && {
        illnessRecoveredDate: userInfo.medicalDischargeDate,
      }),
    }),
  };
  return withGenuxToken(addExitTimestamp(value))
    .then(async res => {
      if (closingLastVisit) {
        await clearLastVisitInfo();
      } else {
        value.estimatedVisitDuration = estimatedVisitDuration;
        saveScan(value);
      }
      return res;
    })
    .catch(error => error.response);
};

// Function called when a QR code is scanned.
export const scan = async (spaceId, isExit, estimatedVisitDuration) => {
  if (!isExit) {
    return scanEntrance(spaceId, estimatedVisitDuration);
  }
  return scanExit(spaceId, estimatedVisitDuration);
};
