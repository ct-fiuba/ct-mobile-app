import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { getBillboard } from './CTUserAPIService'
import { getCodes, getRisk, saveRisk } from './LocalStorageService'

/*const BACKGROUND_FETCH_TASK = 'fetch-codes';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  const billboard = await getBillboard();

  console.log("billboard es", billboard)

  const codes = await getCodes();

  console.log("codes son", codes)

  let risk = await getRisk();

  console.log("y el risk es", risk)

  codes.forEach(code => {
    let compromisedCode = billboard.find(x => x.userGeneratedCode === code.userGeneratedCode);

    if (compromisedCode && compromisedCode.risk > risk) {
      risk = compromisedCode.risk
    }
  });

  if (risk > 0) {
    await saveRisk(risk)
  }

  // Be sure to return the successful result type!
  return BackgroundFetch.Result.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export const registerBackgroundFetchAsync = async () =>
  BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 10,//60 * 60 * 24, // 24 hours
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });*/
