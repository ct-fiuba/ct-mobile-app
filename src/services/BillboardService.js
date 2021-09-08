import { getBillboard } from './CTUserAPIService'
import { getCodes, saveRisk } from './LocalStorageService'

export const updateRisk = async (oldRisk, onNewRisk, onError) => {
  try {
    const billboard = await getBillboard();

    const codes = await getCodes();

    let newRisk = oldRisk;

    codes.forEach(code => {
      let compromisedCode = billboard.find(x => x.userGeneratedCode === code.userGeneratedCode);

      if (compromisedCode && compromisedCode.risk > newRisk) {
        newRisk = compromisedCode.risk
      }
    });


    if (newRisk !== oldRisk) {
      await saveRisk(newRisk.toString())
      onNewRisk(newRisk)
    }
  }
  catch (error) {
    console.log(error.response)
    onError(error.response.data)
  }
}
