import { BigNumber } from "bignumber.js"
import * as R from "ramda"
import {
  DAO,
  Founder,
  Scheme,
  VotingMachine,
  VotingMachineConfiguration,
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
  votingMachineConfiguration: VotingMachineConfiguration
) => ({
  votingMachineParams: {
    votingMachineName: votingMachineConfiguration.typeName,
    ...votingMachineConfiguration.params,
  },
})
