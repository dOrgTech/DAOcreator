import {
  DAO,
  Founder,
  Scheme,
  SchemeConfig,
  VotingMachineConfiguration,
} from "./types"
import { votingMachines, getVotingMachine } from "./votingMachines"
import {
  getScheme,
  getSchemeCallableParamsArray,
  getVotingMachineCallableParamsArray,
} from "./index"
import hash from "object-hash"
import * as R from "ramda"

export const createDao = async (
  web3: any,
  updateStatus: (message: string) => void,
  deployedContractAddresses: any,
  naming: any,
  founders: Founder[],
  schemesIn: SchemeConfig[]
): Promise<DAO> => {
  updateStatus(
    "Creating new organization. This requires 1 transaction. \n Step 1 of 4."
  )
  const addresses = deployedContractAddresses.base

  const gasPrice = web3.utils.fromWei(await web3.eth.getGasPrice(), "gwei")
  const block = await web3.eth.getBlock("latest")

  const opts = {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000, // TODO: fix
    gasPrice: gasPrice
      ? web3.utils.toWei(gasPrice.toString(), "gwei")
      : undefined,
  }

  const daoCreator = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/DaoCreator.json").abi,
    addresses.DaoCreator,
    opts
  )

  const [
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap, // TODO: Should probably be configurable by the user
  ] = [
    naming.daoName,
    naming.tokenName,
    naming.tokenSymbol,
    founders.map(({ address }) => address),
    founders.map(({ tokens }) => web3.utils.toWei(tokens.toString())),
    founders.map(({ reputation }) => web3.utils.toWei(reputation.toString())),
    addresses.UController,
    "0",
  ]
  const forgeOrg = daoCreator.methods.forgeOrg(
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap
  )

  let tx = await forgeOrg.send()
  console.log("Created new organization.")
  console.log(tx)
  const Avatar = tx.events.NewOrg.returnValues._avatar
  console.log(Avatar)

  const avatar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/Avatar.json").abi,
    Avatar,
    opts
  )
  console.log(avatar)

  const daoToken = await avatar.methods.nativeToken().call()
  console.log(daoToken)
  const reputation = await avatar.methods.nativeReputation().call()
  console.log(reputation)

  const votingMachineConfigToHash = (
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    const callableVotingParams = getVotingMachineCallableParamsArray(
      votingMachineConfig
    )
    return hash({ callableVotingParams })
  }

  const initializedSchemes = R.map(schemeConfig => {
    return {
      schemeConfig,
      schemeContract: new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${
          schemeConfig.typeName
        }.json`).abi,
        addresses[schemeConfig.typeName],
        opts
      ),
      votingMachineHash:
        schemeConfig.params.votingMachineConfig != null
          ? votingMachineConfigToHash(schemeConfig.params.votingMachineConfig)
          : null,
    }
  }, schemesIn)

  const initializedVotingMachines: any = R.reduce(
    (acc, schemeConfig) => {
      if (schemeConfig.params.votingMachineConfig != null) {
        const votingMachineConfig = schemeConfig.params.votingMachineConfig
        const votingMachineContract = new web3.eth.Contract(
          require(`@daostack/arc/build/contracts/${
            votingMachineConfig.typeName
          }.json`).abi,
          addresses[votingMachineConfig.typeName],
          opts
        )
        return R.assoc(
          votingMachineConfigToHash(votingMachineConfig),
          {
            votingMachineContract,
            votingMachineCallableParamsArray: getVotingMachineCallableParamsArray(
              votingMachineConfig
            ),
            votingMachineAddress: addresses[votingMachineConfig.typeName],
          },
          acc
        )
      } else {
        return acc
      }
    },
    {},
    schemesIn
  )

  console.log(
    "[Waiting for transactions] Setting parameters for voting machines"
  )

  const numberOfVotingMachines = R.keys(initializedVotingMachines).length

  updateStatus(
    "Initiating voting machine" +
      (numberOfVotingMachines > 1 ? "s." : ".") +
      ` This requires ${numberOfVotingMachines} transaction` +
      (numberOfVotingMachines > 1 ? "s." : ".") +
      "\n Step 2 of 4"
  )

  const parameterizedVotingMachines = await Promise.all(
    R.map(async votingMachineHash => {
      const {
        votingMachineAddress,
        votingMachineContract,
        votingMachineCallableParamsArray,
      }: any = initializedVotingMachines[votingMachineHash]
      const setParams = votingMachineContract.methods.setParameters.apply(
        null,
        votingMachineCallableParamsArray
      )

      const tx = await setParams.send()
      console.log(`${votingMachineHash.toString()} parameters set.`)
      console.log(tx)

      const getParamsHash = votingMachineContract.methods.getParametersHash.apply(
        null,
        votingMachineCallableParamsArray
      )
      const votingMachineParametersKey = await getParamsHash.call()
      console.log(votingMachineParametersKey)

      return {
        votingMachineAddress,
        votingMachineHash,
        votingMachineParametersKey,
      }
    }, R.keys(initializedVotingMachines))
  )

  const schemeAddresses = R.map(
    ({ schemeConfig }) => addresses[schemeConfig.typeName],
    initializedSchemes
  )
  const schemePermissions = R.map(
    ({ schemeConfig }) => getScheme(schemeConfig.typeName).permissions,
    initializedSchemes
  )

  console.log("[Waiting for transactions] Setting parameters for schemes")

  const numberOfSchemes = R.keys(initializedSchemes).length

  updateStatus(
    "Initiating scheme" +
      (numberOfSchemes > 1 ? "s." : ".") +
      ` This requires ${numberOfSchemes} transaction` +
      (numberOfSchemes > 1 ? "s." : ".") +
      "\n Step 3 of 4"
  )

  const schemeParams = await Promise.all(
    R.map(async ({ schemeConfig, schemeContract, votingMachineHash }) => {
      let deploymentInfo = {
        avatar: Avatar,
        daoToken,
        reputation,
      }

      if (votingMachineHash != null) {
        const { votingMachineAddress, votingMachineParametersKey } = R.find(
          parameterizedVotingMachine =>
            parameterizedVotingMachine.votingMachineHash === votingMachineHash,
          parameterizedVotingMachines
        ) as any
        deploymentInfo = R.merge(deploymentInfo, {
          votingMachineAddress,
          votingMachineParametersKey,
        })
      }
      console.log(deploymentInfo)
      const args = getSchemeCallableParamsArray(schemeConfig, deploymentInfo)
      const setParams = schemeContract.methods.setParameters.apply(null, args)

      const tx = await setParams.send()
      console.log(`${schemeConfig.typeName} parameters set.`)
      console.log(tx)

      const getParamsHash = schemeContract.methods.setParameters.apply(
        null,
        args
      )
      const schemeParametersKey = await getParamsHash.call()
      return schemeParametersKey
    }, initializedSchemes)
  )

  console.log("Setting DAO schemes...")

  updateStatus(
    "Finalizing the organization by adding scheme" +
      (numberOfSchemes > 1 ? "s" : "") +
      " to the organization. This requires 1 transaction." +
      "\n Step 4 of 4"
  )

  tx = await daoCreator.methods
    .setSchemes(
      Avatar,
      schemeAddresses,
      schemeParams,
      schemePermissions,
      "metaData"
    )
    .send()
  console.log("DAO schemes set.")
  console.log(tx)

  return {
    avatar: Avatar,
    tokenName,
    tokenSymbol,
    name: orgName,
    daoToken,
    reputation,
  }
}
