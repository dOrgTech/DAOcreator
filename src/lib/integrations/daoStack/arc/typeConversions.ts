import { NewDaoConfig, FounderConfig, SchemeConfig } from "@daostack/arc.js"
import { BigNumber } from "bignumber.js"
import * as R from "ramda"
import { VotingMachine } from "./votingMachines"

const toFounderConfigs = (founders: Founder[]): FounderConfig[] =>
  R.map(
    ({ address, tokens, reputation }) => ({
      address,
      tokens: new BigNumber(tokens),
      reputation: new BigNumber(reputation),
    }),
    founders
  )

const toSchemasConfig = (schemas: string[]): SchemeConfig[] =>
  R.map(schameName => ({ name: schameName }), schemas)

const toVotingMachineParams = (votingMachine: VotingMachine) => ({
  votingMachineParams: {
    votingMachineName: votingMachine.typeName,
  },
})

export const toNewDaoConfig = (
  naming: any,
  founders: Founder[],
  schemas: string[],
  votingMachine: VotingMachine
) => {
  const { daoName, tokenName, tokenSymbol } = naming
  return {
    name: daoName,
    // tokenCap?: BigNumber | string,
    tokenName,
    tokenSymbol,
    founders: toFounderConfigs(founders),
    // daoCreatorAddress?: Address,
    // universalController?: boolean,
    votingMachineParams: toVotingMachineParams(votingMachine),
    schemes: toSchemasConfig(schemas),
  }
}
