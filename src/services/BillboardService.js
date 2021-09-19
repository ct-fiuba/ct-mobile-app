import { getBillboard } from './CTUserAPIService';
import { getCodes, saveRisk } from './LocalStorageService';
import { RISK_INFO } from '../constants/risk';

export const updateRisk = async (oldRisk, onNewRisk, onError) => {
  try {
    const billboard = await getBillboard();

    const codes = await getCodes();

    let newRisk = 0;

    for (const code of codes) {
      const compromisedCode = billboard.find(
        x => x.userGeneratedCode === code.userGeneratedCode
      );

      if (compromisedCode && compromisedCode.risk > newRisk) {
        newRisk = compromisedCode.risk;
        if (newRisk >= RISK_INFO.length - 1) {
          break;
        }
      }
    }

    if (newRisk !== oldRisk) {
      await saveRisk(newRisk.toString());
      onNewRisk(newRisk);
    }
  } catch (error) {
    console.error(error.response);
    onError(error.response.data);
  }
};
