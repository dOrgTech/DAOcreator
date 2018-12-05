import { FounderConfig } from "@daostack/arc.js"
import { BigNumber } from "bignumber.js"

export const toFounderConfigs = (founders: Founder[]): Array<FounderConfig> => {
  return founders.map(founder => {
    return {
      address: founder.address,
      tokens: new BigNumber(founder.tokens),
      reputation: new BigNumber(founder.reputation),
    } as FounderConfig
  })
}
