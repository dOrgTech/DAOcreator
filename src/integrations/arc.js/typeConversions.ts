import { FounderConfig } from "@daostack/arc.js"
import { BigNumber } from "bignumber.js"
import * as R from "ramda"

export const toFounderConfigs = (founders: Founder[]): FounderConfig[] =>
  R.map(
    ({ address, tokens, reputation }) => ({
      address,
      tokens: new BigNumber(tokens),
      reputation: new BigNumber(reputation),
    }),
    founders
  )
