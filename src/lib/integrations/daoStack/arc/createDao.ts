import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
} from "./types"

export const createDao = async (
  web3: any,
  deployedContractAddresses: any,
  naming: any,
  founders: Founder[]
  // schemes: Scheme[],
  // votingMachine: VotingMachineConfiguration
): Promise<DAO> => {
  const {
    UController,
    DaoCreator,
    SchemeRegistrar,
    GlobalConstraintRegistrar,
    UpgradeScheme,
    ContributionReward,
    GenesisProtocol,
    AbsoluteVote,
  } = deployedContractAddresses.base

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
    DaoCreator,
    opts
  )
  const schemeRegistrar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/SchemeRegistrar.json").abi,
    SchemeRegistrar,
    opts
  )
  const globalConstraintRegistrar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/GlobalConstraintRegistrar.json").abi,
    GlobalConstraintRegistrar,
    opts
  )
  const upgradeScheme = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/UpgradeScheme.json").abi,
    UpgradeScheme,
    opts
  )
  const contributionReward = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/ContributionReward.json").abi,
    ContributionReward,
    opts
  )
  const genesisProtocol = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/GenesisProtocol.json").abi,
    GenesisProtocol,
    opts
  )
  const absoluteVote = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/AbsoluteVote.json").abi,
    AbsoluteVote,
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
    UController,
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
  console.log("Setting AbsoluteVote parameters...")

  const absoluteVoteSetParams = absoluteVote.methods.setParameters(
    migrationParam.AbsoluteVote.votePerc,
    migrationParam.AbsoluteVote.voteOnBehalf
  )
  const absoluteVoteParams = await absoluteVoteSetParams.call()
  tx = await absoluteVoteSetParams.send()
  console.log("AbsoluteVote parameters set.")
  console.log(tx)

  console.log("Setting SchemeRegistrar parameters...")
  const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
    absoluteVoteParams,
    absoluteVoteParams,
    AbsoluteVote
  )
  const schemeRegistrarParams = await schemeRegistrarSetParams.call()
  tx = await schemeRegistrarSetParams.send()
  console.log("SchemeRegistrar parameters set.")
  console.log(tx)

  console.log("Setting GlobalConstraintRegistrar parameters...")
  const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  )
  const globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call()
  tx = await globalConstraintRegistrarSetParams.send()
  console.log("GlobalConstraintRegistrar parameters set.")
  console.log(tx)

  console.log("Setting UpgradeScheme parameters...")
  const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
    absoluteVoteParams,
    AbsoluteVote
  )
  const upgradeSchemeParams = await upgradeSchemeSetParams.call()
  tx = await upgradeSchemeSetParams.send()
  console.log("UpgradeScheme parameters set.")
  console.log(tx)

  console.log("Setting GenesisProtocol parameters...")
  const genesisProtocolSetParams = genesisProtocol.methods.setParameters(
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
  const genesisProtocolParams = await genesisProtocolSetParams.call()
  tx = await genesisProtocolSetParams.send()
  console.log("GenesisProtocol parameters set.")
  console.log(tx)

  console.log("Setting 'ContributionReward' parameters...")
  const contributionRewardSetParams = contributionReward.methods.setParameters(
    web3.utils.toWei(
      migrationParam.ContributionReward.orgNativeTokenFeeGWei.toString(),
      "gwei"
    ),
    genesisProtocolParams,
    GenesisProtocol
  )
  const contributionRewardParams = await contributionRewardSetParams.call()
  tx = await contributionRewardSetParams.send()
  console.log("ContributionReward parameters set.")
  console.log(tx)

  const schemes = [
    SchemeRegistrar,
    GlobalConstraintRegistrar,
    UpgradeScheme,
    ContributionReward,
  ]
  const params = [
    schemeRegistrarParams,
    globalConstraintRegistrarParams,
    upgradeSchemeParams,
    contributionRewardParams,
  ]
  const permissions = [
    "0x0000001F" /* all permissions */,
    "0x00000004" /* manage global constraints */,
    "0x0000000A" /* manage schemes + upgrade controller */,
    "0x00000000" /* no permissions */,
  ]

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
