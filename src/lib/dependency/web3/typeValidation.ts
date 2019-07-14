import * as Web3Utils from "web3-utils"

export const isAddress = (address: string): boolean => {
  return Web3Utils.isAddress(address)
}

export const isBigNumber = (number: string): boolean => {
  try {
    Web3Utils.toBN(number)
    return true
  } catch {
    return false
  }
}
