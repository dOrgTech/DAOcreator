import { DAO, Founder, Scheme, VotingMachineConfiguration } from "./types"
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

  const Avatar = await forgeOrg.call()
  let tx = await forgeOrg.send()
  console.log("Created new organization.")
  console.log(tx)

  const votingMachineConfigToHash = (
    votingMachineConfig: VotingMachineConfiguration
  ) => {
    const votingMachine = votingMachines[votingMachineConfig.typeName]
    const callableVotingParams = votingMachine.getCallableParamsArray(
      votingMachineConfig
    )
    return hash({ callableVotingParams })
  }

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

  console.log(
    "[Waiting for transactions] Setting parameters for voting machines"
  )
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

      const votingMachineParametersKey = await setParams.call()

      const tx = await setParams.send()
      console.log(`${votingMachineHash.toString()} parameters set.`)
      console.log(tx)

      return {
        votingMachineHash,
        votingMachineParametersKey,
      }
    }, R.keys(initializedVotingMachines))
  )

  const schemeAddresses = R.map(
    ({ scheme }) => addresses[scheme.typeName],
    initializedSchemes
  )
  const schemePermissions = R.map(
    ({ scheme }) => scheme.permissions,
    initializedSchemes
  )

  console.log("[Waiting for transactions] Setting parameters for schemes")
  const schemeParams = await Promise.all(
    R.map(async ({ scheme, schemeContract, votingMachineHash }) => {
      const { votingMachineParametersKey } = R.find(
        parameterizedVotingMachine =>
          parameterizedVotingMachine.votingMachineHash === votingMachineHash,
        parameterizedVotingMachines
      ) as any
      const { votingMachineAddress } = initializedVotingMachines[
        votingMachineHash
      ]

      const setParams = schemeContract.methods.setParameters.apply(
        null,
        scheme.getCallableParamsArray(
          votingMachineParametersKey,
          votingMachineAddress
        )
      )
      const schemeParametersKey = await setParams.call()

      const tx = await setParams.send()
      console.log(`${scheme.typeName} parameters set.`)
      console.log(tx)

      return schemeParametersKey
    }, initializedSchemes)
  )

  console.log("Setting DAO schemes...")
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
