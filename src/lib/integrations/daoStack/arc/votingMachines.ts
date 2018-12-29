import { VotingMachine } from "./types"

export const votingMachines: VotingMachine[] = [
  {
    typeName: "AbsoluteVote",
    displayName: "Absolute Vote",
    description:
      "This system counts one person one vote and a majority is determined by a percentage.",
    params: [
      {
        typeName: "ownerVote",
        valueType: "boolean",
        displayName: "Proposer",
        description: "The participant who called the voting mechanism",
        defaultValue: true,
      },
      {
        typeName: "votePerc",
        valueType: "number",
        displayName: "Majority Percentage",
        description:
          "The percenatge of voters necessary to reach a valid decision. Default: 50%",
        defaultValue: 50,
      },
    ],
  },
  {
    typeName: "GenesisProtocol",
    displayName: "Genesis Protocol",
    description:
      "This is the first iteration of the GenesisDAO protocol. This voting machine reflects the rules for staking and boosting proposals where voters lose or gain REP depending on the outcome.",
    params: [
      {
        typeName: "boostedVotePeriodLimit",
        valueType: "number",
        displayName: "Boosted Vote Period Limit",
        description:
          "The time limit in seconds for a proposal to be in the boosted phase, inclusive of the quietEndingPeriod, in seconds. Default is 259200 (three days).",
        defaultValue: 259200,
      },
      {
        typeName: "daoBountyConst",
        valueType: "number",
        displayName: "DAO Bounty Const",
        description:
          "Multiple of a winning stake to be rewarded as bounty. Must be greater than stakerFeeRatioForVoters and less than 2*stakerFeeRatioForVoters. Default is 75.",
        defaultValue: 75,
      },
      {
        typeName: "daoBountyLimit",
        valueType: "BigNumber",
        displayName: "DAO Bounty Limit",
        description:
          "Upper bound on the total bounty amount on a proposal. Default is 100, converted to Wei.",
        defaultValue: 100,
      },
      {
        typeName: "minimumStakingFee",
        valueType: "BigNumber",
        displayName: "Minimum Staking Fee",
        description:
          "A floor on the staking fee which is normally computed using [[GenesisProtocolParams.stakerFeeRatioForVoters]], in Wei.  Default is 0.",
        defaultValue: 0,
      },
      {
        typeName: "preBoostedVotePeriodLimit",
        valueType: "number",
        displayName: "Pre Boosted Vote Period Limit",
        description:
          " The time limit in seconds that a proposal can be in the preBoosted phase before it will be automatically closed, in seconds, with a winning vote of NO, regardless of the actual value of the winning vote at the time expiration. Note an attempt must be made to execute before the proposal state will actually change. Default is 1814400 (three weeks).",
        defaultValue: 1814400,
      },
      {
        typeName: "preBoostedVoteRequiredPercentage",
        valueType: "number",
        displayName: "Pre Boosted Vote Required Percentage",
        description:
          "The percent of the DAO's total supply of reputation that, when exceeded by the amount of reputation behind a vote (yes or no), will result in the immediate execution of the proposal, during either the preboosted or boosted phases. Must be greater than zero and less than or equal to 100. Default is 50.",
        defaultValue: 50,
      },
      {
        typeName: "proposingRepRewardConstA",
        valueType: "number",
        displayName: "Proposing Rep Reward Const A",
        description:
          " Constant A in the calculation of the proposer's reputation reward. Must be between 0 and 100000000. Default is 5.",
        defaultValue: 5,
      },
      {
        typeName: "proposingRepRewardConstB",
        valueType: "number",
        displayName: "Proposing Rep Reward Const B",
        description:
          "Constant B in the calculation of the proposer's reputation reward. Must be between 0 and 100000000. Default is 5.",
        defaultValue: 5,
      },
      {
        typeName: "quietEndingPeriod",
        valueType: "number",
        displayName: "Quiet Ending Period",
        description:
          "The duration, in seconds, at the end of the boosted phase during which any vote that changes the outcome of a proposal will cause the boosted phase to be extended by the amount of the quietEndingPeriod.  If the quietEndingPeriod expires then the proposal expires and may be executed.  It is a moving window:  If the winning vote switches during the quietEndingPeriod then it restarts at the point in time when the vote switched, thus extending the boosted period. Default is 86400 (one day).",
        defaultValue: 86400,
      },
      {
        typeName: "stakerFeeRatioForVoters",
        valueType: "number",
        displayName: "Staker Fee Ratio For Voters",
        description:
          "For executed proposals, the percentage of staked tokens that is rewarded to all voters, regardless of the vote outcome, the staked vote outcome, or how the voter voted. Voters share this amount in proportion to the amount of reputation they voted. Must be between 0 and 100. Default is 50.",
        defaultValue: 50,
      },
      {
        typeName: "thresholdConstA",
        valueType: "BigNumber",
        displayName: "Threshold Const A",
        description:
          "Constant A in the threshold calculation, in Wei. See [[GenesisProtocolWrapper.getThreshold]]. If the difference between Yes and No votes exceeds the threshold, then the proposal may be boosted. Must be between 0 and 100000000 (converted to Wei). Default is 7, converted to Wei.",
        defaultValue: 7,
      },
      {
        typeName: "thresholdConstB",
        valueType: "BigNumber",
        displayName: "Threshold Const B",
        description:
          " Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]]. If the difference between Yes and No votes exceeds the threshold, then the proposal may be boosted. Must be greater than zero and less than or equal to 100000000. Default is 3.",
        defaultValue: 3,
      },
      {
        typeName: "voteOnBehalf",
        valueType: "Address",
        displayName: "Vote On Behalf",
        description:
          "optional, to always vote on behalf of the given account.  Otherwise is `msg.sender`.",
        defaultValue: "",
        optional: true,
      },
      {
        typeName: "votersGainRepRatioFromLostRep",
        valueType: "number",
        displayName: "Voters Gain Rep Ratio From Lost Rep",
        description:
          "The percentage of losing pre-boosted voters' lost reputation (see votersReputationLossRatio) rewarded to winning pre-boosted voters. Must be between 0 and 100. Default is 80. ",
        defaultValue: 80,
      },
      {
        typeName: "votersReputationLossRatio",
        valueType: "number",
        displayName: "Voters Reputation Loss Ratio",
        description:
          "The percentage of reputation deducted from losing pre-boosted voters. Must be between 0 and 100. Default is 1.",
        defaultValue: 1,
      },
    ],
  },
  {
    typeName: "QuorumVote",
    displayName: "Quorum Vote",
    description:
      "Every member has one vote and a quorum is reached based on a ratio of the total number of possible participants",
    params: [],
    // TODO: add params https://daostack.github.io/arc/generated_docs/VotingMachines/QuorumVote/
  },
]
