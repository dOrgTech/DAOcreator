//import * as rawWeb3 from "web3"
//const Web3 = rawWeb3 as any

const Web3 = require("web3")

export const isAddress = (address: string): boolean =>
  Web3.utils.isAddress(address)

export const isBigNumber = (number: string): boolean => {
  try {
    Web3.utils.toBN(number)
    return true
  } catch {
    return false
  }
}
