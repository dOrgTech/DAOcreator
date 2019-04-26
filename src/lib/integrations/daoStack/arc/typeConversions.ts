import { BigNumber } from "bignumber.js"
import * as R from "ramda"
import {
  DAO,
  Founder,
  SchemeDefinition,
  VotingMachineDefinition,
  VotingMachineConfig,
} from "./types"

const toFounderConfigs = (founders: Founder[]): any[] =>
  R.map(
    ({ address, tokens, reputation }) => ({
      address,
      tokens: new BigNumber(tokens),
      reputation: new BigNumber(reputation),
      daoAvatarAddress: "",
      redemptions: [],
      stakes: [],
      votes: [],
    }),
    founders
  )

const toVotingMachineParams = (
  votingMachineConfiguration: VotingMachineConfig
) => ({
  votingMachineParams: {
    votingMachineName: votingMachineConfiguration.typeName,
    ...votingMachineConfiguration.params,
  },
})
