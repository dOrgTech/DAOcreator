import * as typeValidation from "./typeValidation"
import * as rawWeb3 from "web3"
const Web3 = rawWeb3 as any

export const getWeb3 = async (): Promise<any> => {
  const ethereum = (window as any).ethereum
  const web3 = (window as any).web3

  if (ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable()

      // Acccounts now exposed
      return new Web3(ethereum)
    } catch (error) {
      return Promise.reject("User denied account access...")
    }
  }
  // Legacy dapp browsers...
  else if (web3) {
    return new Web3(web3.currentProvider)
    // Acccounts always exposed
  }
  // Non-dapp browsers...
  else {
    return Promise.reject(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    )
  }
}

export const TypeValidation = typeValidation
