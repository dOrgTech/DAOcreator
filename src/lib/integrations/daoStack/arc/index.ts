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
    deployedContractAddresses: {
      live: {
        base: {
          GEN: "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf",
          ControllerCreator: "0x666409266dCc2487CDdB8250DEfBad2c8b4C4206",
          DaoCreator: "0x9C43F4782Ebe90Be98858a1BaB27b7Df0c7E60D3",
          UController: "0x9b3b23887f4e32b2E3A921051356f9CC80137fd1",
          GenesisProtocol: "0x50932521953CA7a1fA11434891cc9D9b0183fBc5",
          SchemeRegistrar: "0xa94b887e15f30db3831AcdDDCd2008a0fFDDe0E3",
          UpgradeScheme: "0xbdb4067bb6a91f6CD0F1E6ADCd1023Faf9D8aD61",
          GlobalConstraintRegistrar:
            "0x3c5c47e8c024C079538FD2a49F6cF024d5c9911e",
          ContributionReward: "0x082Ea4D85055dE18297be0F112240F8c6a6ae319",
          AbsoluteVote: "0x2960F52B236a0ff5099ad033461832Fae902dE88",
          QuorumVote: "0xc61AD8Cbe39D13617ca70d8D0c8271d179705994",
          TokenCapGC: "0x7A9737151E312457E09b8B201C39173008366068",
          VestingScheme: "0xf91487d8e6bb7B149882175420fFa48B65E21144",
          VoteInOrganizationScheme:
            "0x1eC50ECedE754Ceb98007276a14906b81BDF151b",
          OrganizationRegister: "0x2AcD726D5B5d90835420faD14A5726aF1fA2dc44",
          Redeemer: "0xb30dBBc27D43822a4e53AD9a6643234cbeE20c63",
          GenericScheme: "0x1f6E0a3dCADBcd86E5dC5f7157b5802035CF59d1",
        },
      },
    },
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
