import { VotingMachine } from "./types"

export const votingMachines: VotingMachine[] = [
  {
    typeName: "AbsoluteVote",
    displayName: "Absolute Vote",
    description: "Absolute Vote: useful description TODO",
    params: {
      ownerVote: "boolean",
      votePerc: "number",
    },
  },
  {
    typeName: "GenesisProtocol",
    displayName: "Genesis Protocol",
    description: "Genesis Protocol: useful description TODO",
    params: {
      /**
       * The time limit in seconds for a proposal to be in the boosted phase,
       * inclusive of the quietEndingPeriod, in seconds.
       * Default is 259200 (three days).
       */
      boostedVotePeriodLimit: "number",
      /**
       * Multiple of a winning stake to be rewarded as bounty.
       * Must be greater than stakerFeeRatioForVoters and less than 2*stakerFeeRatioForVoters.
       * Default is 75.
       */
      daoBountyConst: "number",
      /**
       * Upper bound on the total bounty amount on a proposal.
       * Default is 100, converted to Wei.
       */
      daoBountyLimit: "BigNumber",
      /**
       * A floor on the staking fee which is normally computed using
       * [[GenesisProtocolParams.stakerFeeRatioForVoters]], in Wei.
       * Default is 0.
       */
      minimumStakingFee: "BigNumber",
      /**
       * The time limit in seconds that a proposal can be in the preBoosted phase before
       * it will be automatically closed, in seconds, with a winning vote of NO, regardless
       * of the actual value of the winning vote at the time expiration.
       * Note an attempt must be made to execute before the proposal state will actually change.
       * Default is 1814400 (three weeks).
       */
      preBoostedVotePeriodLimit: "number",
      /**
       * The percent of the DAO's total supply of reputation that, when exceeded
       * by the amount of reputation behind a vote (yes or no), will result
       * in the immediate execution of the proposal, during either the preboosted
       * or boosted phases.
       * Must be greater than zero and less than or equal to 100.
       * Default is 50.
       */
      preBoostedVoteRequiredPercentage: "number",
      /**
       * Constant A in the calculation of the proposer's reputation reward.
       * Must be between 0 and 100000000.
       * Default is 5.
       */
      proposingRepRewardConstA: "number",
      /**
       * Constant B in the calculation of the proposer's reputation reward.
       * Must be between 0 and 100000000.
       * Default is 5.
       */
      proposingRepRewardConstB: "number",
      /**
       * The duration, in seconds, at the end of the boosted phase during which any vote that changes the
       * outcome of a proposal will cause the boosted phase to be extended by the amount
       * of the quietEndingPeriod.  If the quietEndingPeriod expires then the proposal
       * expires and may be executed.  It is a moving window:  If the winning vote switches during
       * the quietEndingPeriod then it restarts at the point in time when the vote switched, thus extending
       * the boosted period.
       * Default is 86400 (one day).
       */
      quietEndingPeriod: "number",
      /**
       * For executed proposals, the percentage of staked tokens that is rewarded to all voters,
       * regardless of the vote outcome, the staked vote outcome, or how the voter voted.
       * Voters share this amount in proportion to the amount of reputation they voted.
       * Must be between 0 and 100.
       * Default is 50.
       */
      stakerFeeRatioForVoters: "number",
      /**
       * Constant A in the threshold calculation, in Wei. See [[GenesisProtocolWrapper.getThreshold]].
       * If the difference between Yes and No votes exceeds the threshold, then the
       * proposal may be boosted.
       * Must be between 0 and 100000000 (converted to Wei).
       * Default is 7, converted to Wei.
       */
      thresholdConstA: "BigNumber",
      /**
       * Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]].
       * If the difference between Yes and No votes exceeds the threshold, then the
       * proposal may be boosted.
       * Must be greater than zero and less than or equal to 100000000.
       * Default is 3.
       */
      thresholdConstB: "number",
      /**
       * optional, to always vote on behalf of the given account.  Otherwise is `msg.sender`.
       */
      voteOnBehalf: "Address",
      /**
       * The percentage of losing pre-boosted voters' lost reputation (see votersReputationLossRatio)
       * rewarded to winning pre-boosted voters.
       * Must be between 0 and 100.
       * Default is 80.
       */
      votersGainRepRatioFromLostRep: "number",
      /**
       * The percentage of reputation deducted from losing pre-boosted voters.
       * Must be between 0 and 100.
       * Default is 1.
       */
      votersReputationLossRatio: "number",
    },
  },
]
