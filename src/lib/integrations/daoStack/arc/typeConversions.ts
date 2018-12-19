import {
  NewDaoConfig,
  FounderConfig,
  SchemeConfig,
  DAO as ArcDAO,
} from "@daostack/arc.js"
import { BigNumber } from "bignumber.js"
import * as R from "ramda"
import { Founder, VotingMachine, Schema } from "./types"

const toFounderConfigs = (founders: Founder[]): FounderConfig[] =>
  R.map(
    ({ address, tokens, reputation }) => ({
      address,
      tokens: new BigNumber(tokens),
      reputation: new BigNumber(reputation),
    }),
    founders
  )

const toSchemasConfig = (schemas: Schema[]): SchemeConfig[] =>
  R.map(schame => ({ name: schame.typeName }), schemas)

const toVotingMachineParams = (votingMachine: VotingMachine) => ({
  votingMachineParams: {
    votingMachineName: votingMachine.typeName,
  },
})

export const toNewDaoConfig = (
  naming: any,
  founders: Founder[],
  schemas: Schema[],
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

export const fromDao = async (arkDao: ArcDAO) => ({
  avatarAddress: arkDao.avatar.address,
  controllerAddress: arkDao.controller.address,
  tokenName: arkDao.token.name,
  tokenSymbol: await arkDao.token.getTokenSymbol(),
  name: arkDao.name,
})
