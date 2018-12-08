import * as Web3 from "web3"

export const cleanseAddress = (address: string): boolean => {
  return Web3.isAddress(address)
}

export const cleanseBigNumber = (number: string): boolean => {
  return Web3.isBigNumber(number)
}
