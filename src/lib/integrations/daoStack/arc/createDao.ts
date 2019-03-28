import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
} from "./types"
import { votingMachines } from "./votingMachines"
import hash from "object-hash"
import * as R from "ramda"

export const createDao = async (
  web3: any,
  deployedContractAddresses: any,
  naming: any,
  founders: Founder[],
  schemesIn: {
    scheme: Scheme
    votingMachineConfig: VotingMachineConfiguration
  }[]
): Promise<DAO> => {
  const addresses = deployedContractAddresses.base

  // TODO: this is still hardcoded, must fix
  const migrationParam = {
    ContributionReward: {
      orgNativeTokenFeeGWei: 0,
    },
  }
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

  // TODO: clean thus up!
  const [
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap,
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

  const Avatar = await forgeOrg.call()
  let tx = await forgeOrg.send()
  console.log("Created new organization.")
  console.log(tx)

  // TODO:
  // 1. make array of promises out of the votingmachine parameter setting
  // 2. wait for Promise.all on it
  // 3. Do not let

  //  Array of Promises
  // Array of promises + votingmachines
  // Go through all schemes and parameterize the voting machines
  //
  const votingMachineConfigToHash = (
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    const votingMachine = votingMachines[votingMachineConfig.typeName]
    const callableVotingParams = votingMachine.getCallableParamsArray(
      votingMachineConfig
    )
    return hash({ callableVotingParams })
  }

  //
  // {
  // scheme,
  // schemeContract,
  // VotingMachineHash,
  // }
  const initializedSchemes = R.map(({ scheme, votingMachineConfig }) => {
    return {
      scheme,
      schemeContract: new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${scheme.typeName}.json`).abi,
        addresses[scheme.typeName],
        opts
      ),
      votingMachineHash: votingMachineConfigToHash(votingMachineConfig),
    }
  }, schemesIn)

  //
  // {
  // votingMachineHash: {
  //   votingMachineContract,
  //   votingMachineCallableParamsArray,
  //   votingMachineAddress
  // }
  // }
  const initializedVotingMachines: any = R.reduce(
    (acc, { votingMachineConfig }) => {
      const votingMachine = votingMachines[votingMachineConfig.typeName]
      const votingMachineContract = new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${
          votingMachine.typeName
        }.json`).abi,
        addresses[votingMachine.typeName],
        opts
      )
      return R.assoc(
        votingMachineConfigToHash(votingMachineConfig),
        {
          votingMachineContract,
          votingMachineCallableParamsArray: votingMachine.getCallableParamsArray(
            votingMachineConfig
          ),
          votingMachineAddress: addresses[votingMachine.typeName],
        },
        acc
      )
    },
    {},
    schemesIn
  )

  // Promise
  // [{
  // votingMachineHash,
  // votingMachineParameters (already set)
  // }]
  const parameterizedVotingMachines = await Promise.all(
    R.map(async votingMachineHash => {
      const {
        votingMachineContract,
        votingMachineCallableParamsArray,
      }: any = initializedVotingMachines[votingMachineHash]
      const setParams = votingMachineContract.methods.setParameters.apply(
        null,
        votingMachineCallableParamsArray
      )

      const votingMachineParameters = await setParams.call()

      const tx = await setParams.send()
      console.log(`${votingMachineHash.toString()} parameters set.`)
      console.log(tx)

      return {
        votingMachineHash,
        votingMachineParameters,
      }
    }, R.keys(initializedVotingMachines))
  )

  // Promise
  //{
  //
  // }
  const parameterizedSchemes = {}

  // TODO:
  // 0. Make getCallableParamsArray for schemes (like done in voting machines)
  // 1. make array of promises out of the scheme parameter setting
  // 2. wait for Promise.all on it
  // 3. Do not let
  let schemes: any[] = []
  let params: any[] = []
  let permissions: any[] = []
  // Setup schemes
  await R.map(async ({ scheme, schemeContract, votingMachineHash }) => {
    const { votingMachineParameters } = R.find(
      parameterizedVotingMachine =>
        parameterizedVotingMachine.votingMachineHash === votingMachineHash,
      parameterizedVotingMachines
    ) as any
    const { votingMachineAddress } = initializedVotingMachines[
      votingMachineHash
    ]
    let setParams: any

    if (scheme.typeName === "SchemeRegistrar") {
      setParams = schemeContract.methods.setParameters(
        votingMachineParameters,
        votingMachineParameters,
        votingMachineAddress
      )
    } else if (scheme.typeName === "ContributionReward") {
      setParams = schemeContract.methods.setParameters(
        web3.utils.toWei(
          migrationParam.ContributionReward.orgNativeTokenFeeGWei.toString(),
          "gwei"
        ),
        votingMachineParameters,
        votingMachineAddress
      )
    } else {
      setParams = schemeContract.methods.setParameters(
        votingMachineParameters,
        votingMachineAddress
      )
    }
    params = R.append(await setParams.call(), params)
    schemes = R.append(addresses[scheme.typeName], schemes)
    permissions = R.append(scheme.permissions, permissions)
    const tx = await setParams.send()
    console.log(`${scheme.typeName} parameters set.`)
    console.log(tx)
  }, initializedSchemes)

  console.log("Setting DAO schemes...")
  tx = await daoCreator.methods
    .setSchemes(Avatar, schemes, params, permissions, "metaData")
    .send()
  console.log("DAO schemes set.")
  console.log(tx)

  const avatar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/Avatar.json").abi,
    Avatar,
    opts
  )

  const daoToken = await avatar.methods.nativeToken().call()
  const reputation = await avatar.methods.nativeReputation().call()

  return {
    avatar: Avatar,
    tokenName,
    tokenSymbol,
    name: orgName,
    daoToken,
    reputation,
  }
}
