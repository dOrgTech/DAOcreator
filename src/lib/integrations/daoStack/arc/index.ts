export * from "./types"
export * from "./typeConversions"
export * from "./schemes"
export * from "./votingMachines"

import {
  DAO as ArcDAO,
  NewDaoConfig,
  ConfigService,
  InitializeArcJs,
} from "@daostack/arc.js"
import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
} from "./types"
import { toNewDaoConfig, fromDao } from "./typeConversions"

let isInitialized = false

export const init = async (web3: any) => {
  ;(global as any).web3 = web3

  // Initialize the ArcJS library
  ConfigService.set("estimateGas", true)
  ConfigService.set("txDepthRequiredForConfirmation.kovan", 0)

  // TODO: If you use Kovan uncomment this line
  // ConfigService.set("network", "kovan") // Set the network used to Kovan

  await InitializeArcJs({
    watchForAccountChanges: true,
  })

  isInitialized = true
}

export const createDao = async (
  naming: any,
  founders: Founder[],
  schemes: Scheme[],
  votingMachine: VotingMachineConfiguration
): Promise<DAO> => {
  if (!isInitialized) {
    console.log(
      "Arc Uninitialized: initialize the Arc module before calling createDao."
    )
    throw Promise.reject("initialize Arc first")
  }

  const newDaoConfig: NewDaoConfig = toNewDaoConfig(
    naming,
    founders,
    schemes,
    votingMachine
  )

  try {
    const rawDao: ArcDAO = await ArcDAO.new(newDaoConfig)
    console.log("DAO created")
    console.log(rawDao)

    const dao: DAO = await fromDao(rawDao)
    console.log(dao)

    return dao
  } catch (e) {
    console.log("Error while deploying DAO:")
    console.error(e)
    return Promise.reject(e)
  }
}
