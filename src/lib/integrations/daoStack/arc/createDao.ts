import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
} from "./types"

import hash from "object-hash"

import * as R from "ramda"

export const createDao = async (
  web3: any,
  deployedContractAddresses: any,
  naming: any,
  founders: Founder[],
  schemesIn: { scheme: Scheme; votingMachine: VotingMachineConfiguration }[]
  // votingMachine: VotingMachineConfiguration
): Promise<DAO> => {
  const addresses = deployedContractAddresses.base

  const migrationParam = {
    AbsoluteVote: {
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      votePerc: 50,
    },

    GenesisProtocol: {
      boostedVotePeriodLimit: 600,
      daoBountyConst: 10,
      minimumDaoBountyGWei: 100,
      queuedVotePeriodLimit: 1800,
      queuedVoteRequiredPercentage: 50,
      preBoostedVotePeriodLimit: 600,
      proposingRepRewardGwei: 5,
      quietEndingPeriod: 300,
      thresholdConst: 2000,
      voteOnBehalf: "0x0000000000000000000000000000000000000000",
      votersReputationLossRatio: 1,
      activationTime: 0,
    },
    ContributionReward: {
      orgNativeTokenFeeGWei: 0,
    },
  }
  const gasPrice = web3.utils.fromWei(await web3.eth.getGasPrice(), "gwei")
  const block = await web3.eth.getBlock("latest")

  const opts = {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000,
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

  // TODO: load schemes -> set parameters for voting machine (if it does not match another schemes voting parameters,
  // then reuse that (i.e. Absolut voting with 50%)) -> set parameters for scheme (How do we know the number of arguments?)
  let votingInits: any = {}
  let schemeInits: any[] = []

  await R.map(async ({ scheme, votingMachine }) => {
    const contract = new web3.eth.Contract(
      require(`@daostack/arc/build/contracts/${scheme.typeName}.json`).abi,
      addresses[scheme.typeName],
      opts
    )
    const votingParams = votingMachine.params
    const votingMachineType = votingMachine.typeName
    const votingHash = hash({ votingMachineType, votingParams })
    if (votingInits[votingHash] == null) {
      const votingMachine = new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${votingMachineType}.json`).abi,
        addresses[votingMachineType],
        opts
      )
      let setParams: any
      if (votingMachineType === "AbsoluteVote") {
        if (!R.contains("votePerc", R.keys(votingParams))) {
          throw new Error(
            `Missing parameter votePerc in AbsoluteVote voting machine`
          )
        }
        if (!R.contains("voteOnBehalf", R.keys(votingParams))) {
          throw new Error(
            `Missing parameter voteOnBehalf in AbsoluteVote voting machine`
          )
        }

        setParams = votingMachine.methods.setParameters(
          votingParams.votePerc,
          votingParams.voteOnBehalf
        )
      } else if (votingMachineType === "GenesisProtocol") {
        setParams = votingMachine.methods.setParameters(
          [
            migrationParam.GenesisProtocol.queuedVoteRequiredPercentage,
            migrationParam.GenesisProtocol.queuedVotePeriodLimit,
            migrationParam.GenesisProtocol.boostedVotePeriodLimit,
            migrationParam.GenesisProtocol.preBoostedVotePeriodLimit,
            migrationParam.GenesisProtocol.thresholdConst,
            migrationParam.GenesisProtocol.quietEndingPeriod,
            web3.utils.toWei(
              migrationParam.GenesisProtocol.proposingRepRewardGwei.toString(),
              "gwei"
            ),
            migrationParam.GenesisProtocol.votersReputationLossRatio,
            web3.utils.toWei(
              migrationParam.GenesisProtocol.minimumDaoBountyGWei.toString(),
              "gwei"
            ),
            migrationParam.GenesisProtocol.daoBountyConst,
            migrationParam.GenesisProtocol.activationTime,
          ],
          migrationParam.GenesisProtocol.voteOnBehalf
        )
      } else {
        throw new Error(`Unknown voting machine type: ${votingMachineType}`)
      }
      votingInits[votingHash] = await setParams.call()
      const tx = await setParams.send()
      console.log(`${votingMachineType} parameters set.`)
      console.log(tx)
    }
    schemeInits = R.append(
      {
        scheme,
        contract,
        votingHash,
        votingMachineType,
      },
      schemeInits
    )
  }, schemesIn)

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
