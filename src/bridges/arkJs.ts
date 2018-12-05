import { FounderConfig } from "@daostack/arc.js"
import { BigNumber } from "bignumber.js"
import * as R from "ramda"

// TODO @jordan: don't know if this refactoring is helpful or not.
// We should decide on using array.map or R.map. I think there are a lot of
// reasons (currying, general composability) to use the ramda package for utils like this.

// Also should we use Array<Type> or Type[]
export const toFounderConfigs = (founders: Founder[]): FounderConfig[] =>
  R.map(
    ({ address, tokens, reputation }) => ({
      address,
      tokens: new BigNumber(tokens),
      reputation: new BigNumber(reputation),
    }),
    founders
  )
