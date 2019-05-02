import deployedContractAddresses from "./contractAddresses.json"
import { Dispatch } from "redux"
import * as R from "ramda"
import uuid from "uuid"
import { createDao as createTheDao } from "./createDao"
import {
  DAO,
  Founder,
  SchemeDefinition,
  VotingMachineDefinition,
  VotingMachineConfig,
  SchemeConfig,
} from "./types"
export * from "./types"
export * from "./schemes"
export * from "./votingMachines"

export const init = async (web3: any) => {
  const network: string = await web3.eth.net.getNetworkType()
  const supportedNetworks = R.keys(deployedContractAddresses)

  if ((deployedContractAddresses as any)[network] != null) {
    return
  } else {
    throw Error(
      "Network not supported. The supported network are: " +
        supportedNetworks.toString()
    )
  }
}

export const createDao = (
  web3: any,
  waitingDetailsUpdater: (message: string) => void
) => async (
  naming: any,
  founders: Founder[],
  schemes: SchemeConfig[]
): Promise<DAO> => {
  try {
    const network: string = await web3.eth.net.getNetworkType()
    const newDao = await createTheDao(
      web3,
      waitingDetailsUpdater,
      (deployedContractAddresses as any)[network],
      naming,
      founders,
      schemes
    )
    console.log("DAO created")
    console.log(newDao)

    return newDao
  } catch (e) {
    console.log("Error while deploying DAO:")
    console.error(e)
    return Promise.reject(e)
  }
}

export const initSchemeConfig = (
  id: string = uuid(),
  typeName: string = "",
  params: any = {}
): SchemeConfig => {
  return {
    id,
    typeName,
    params,
  }
}
