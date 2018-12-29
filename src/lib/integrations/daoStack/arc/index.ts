export * from "./types"
export * from "./typeConversions"
export * from "./schemes"
export * from "./votingMachines"

import {
  DAO,
  NewDaoConfig,
  ConfigService,
  InitializeArcJs,
} from "@daostack/arc.js"
import {
  VotingMachine,
  Founder,
  Scheme,
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
) => {
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
    const rawDao = await DAO.new(newDaoConfig)
    console.log("DAO created")
    console.log(rawDao)
    const dao = await fromDao(rawDao)
    console.log(dao)
    return dao
  } catch (e) {
    console.log("Error while deploying DAO:")
    console.log(e)
    return Promise.reject(e)
  }
}
