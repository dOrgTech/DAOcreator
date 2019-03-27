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

  let votingInits: any = {}
  let schemeInits: any[] = []

  await R.map(async ({ scheme, votingMachineConfig }) => {
    const contract = new web3.eth.Contract(
      require(`@daostack/arc/build/contracts/${scheme.typeName}.json`).abi,
      addresses[scheme.typeName],
      opts
    )
    const votingMachine = votingMachines[votingMachineConfig.typeName]
    const callableVotingParams = votingMachine.getCallableParamsArray(
      votingMachineConfig
    )

    const votingHash = hash({ callableVotingParams })

    if (votingInits[votingHash] == null) {
      const votingMachineContract = new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${
          votingMachine.typeName
        }.json`).abi,
        addresses[votingMachine.typeName],
        opts
      )

      const setParams = votingMachineContract.methods.setParameters.apply(
        null,
        callableVotingParams
      )
      votingInits[votingHash] = await setParams.call()
      const tx = await setParams.send()
      console.log(`${votingMachine.typeName} parameters set.`)
      console.log(tx)
    }
    schemeInits = R.append(
      {
        scheme,
        contract,
        votingHash,
        votingMachineType: votingMachineConfig.typeName,
      },
      schemeInits
    )
  }, schemesIn)

  // TODO:
  // 0. Make getCallableParamsArray for schemes (like done in voting machines)
  // 1. make array of promises out of the scheme parameter setting
  // 2. wait for Promise.all on it
  // 3. Do not let
  let schemes: any[] = []
  let params: any[] = []
  let permissions: any[] = []
  // Setup schemes
  await R.map(async ({ scheme, votingMachineType, contract, votingHash }) => {
    const votingParams = votingInits[votingHash]
    const votingMachineAddress = addresses[votingMachineType]
    let setParams: any

    if (scheme.typeName === "SchemeRegistar") {
      setParams = contract.methods.setParameters(
        votingParams,
        votingParams,
        votingMachineAddress
      )
    } else if (scheme.typeName === "ContributionReward") {
      setParams = contract.methods.setParameters(
        web3.utils.toWei(
          migrationParam.ContributionReward.orgNativeTokenFeeGWei.toString(),
          "gwei"
        ),
        votingParams,
        votingMachineAddress
      )
    } else {
      setParams = contract.methods.setParameters(
        votingParams,
        votingMachineAddress
      )
    }
    params = R.append(await setParams.call(), params)
    schemes = R.append(addresses[scheme.typeName], schemes)
    permissions = R.append(scheme.permissions, permissions)
    const tx = await setParams.send()
    console.log(`${scheme.typeName} parameters set.`)
    console.log(tx)
  }, schemeInits)

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
