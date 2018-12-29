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

export const init = async () => {
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
    await init()
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
    console.log(e)
    return Promise.reject(e)
  }
}
