import * as web3 from "web3"
const Web3 = web3 as any

export const cleanseAddress = (address: string): boolean => {
  return Web3.prototype.isAddress(address)
}

export const cleanseBigNumber = (number: string): boolean => {
  try {
    Web3.prototype.toBigNumber(number)
    return true
  } catch {
    return false
  }
}
