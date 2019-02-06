export * from "./types"
export * from "./typeConversions"
export * from "./schemes"
export * from "./votingMachines"

import {
  DAO as ArcDAO,
  NewDaoConfig,
  ConfigService,
  InitializeArcJs,
  Utils as ArcUtils,
  AccountService,
  ContractWrappers,
} from "@daostack/arc.js"
import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
} from "./types"
import { toNewDaoConfig, fromDao } from "./typeConversions"
import deployedContractAddresses from "./contractAddresses.json"

let isInitialized = false

export const init = async (web3: any) => {
  ;(global as any).web3 = web3

  // Initialize the ArcJS library
  ConfigService.set("estimateGas", true)
  ConfigService.set("txDepthRequiredForConfirmation", { kovan: 0, live: 0 })

  // TODO: If you use Kovan uncomment this line
  // ConfigService.set("network", "kovan") // Set the network used to Kovan

  await InitializeArcJs({
    deployedContractAddresses,
    watchForAccountChanges: true,
    filter: {
      AbsoluteVote: true,
      ContributionReward: true,
      DaoCreator: true,
      GenesisProtocol: true,
      SchemeRegistrar: true,
    },
  })

  ConfigService.set("gasPriceAdjustment", async (defaultGasPrice: any) => {
    try {
      const network = await ArcUtils.getNetworkName()
      if (network.toLowerCase() === "live") {
        const response = await fetch(
          "https://ethgasstation.info/json/ethgasAPI.json"
        ).then(_ => _.json() as any)
        // the api gives results if 10*Gwei
        const gasPrice = response.fast / 10
        return web3.toWei(gasPrice, "gwei")
      } else {
        return defaultGasPrice
      }
    } catch (e) {
      return defaultGasPrice
    }
  })

  AccountService.subscribeToAccountChanges(() => {
    window.location.reload()
  })

  if (ContractWrappers.AbsoluteVote === undefined) {
    const msg = `Arc.js could not find all DAOStack contracts -- are you sure they are deployed in the current network?\n(Arc.ContractWrappers.AbsoluteVote is undefined)`
    throw Error(msg)
  }
  ContractWrappers.AbsoluteVote.contract.constructor.synchronization_timeout = 0
  ContractWrappers.ContributionReward.contract.constructor.synchronization_timeout = 0
  ContractWrappers.DaoCreator.contract.constructor.synchronization_timeout = 0
  ContractWrappers.GenesisProtocol.contract.constructor.synchronization_timeout = 0
  //Arc.ContractWrappers.GlobalConstraintRegistrar.contract.constructor.synchronization_timeout = 0;
  ContractWrappers.SchemeRegistrar.contract.constructor.synchronization_timeout = 0

  console.timeEnd("InitalizeArcJs")

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
