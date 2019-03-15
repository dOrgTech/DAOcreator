//declare module "web3"
import * as typeValidation from "./typeValidation"
//import * as rawWeb3 from "web3"
const Web3 = require("web3")
//const Web3 = rawWeb3 as any

let readyWeb3: any

export const getWeb3 = async (): Promise<any> => {
  if (readyWeb3 != null) {
    return readyWeb3
  }
  const ethereum = (window as any).ethereum
  const web3 = (window as any).web3

  if (ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable()

      // Acccounts now exposed
      readyWeb3 = new Web3(ethereum)
      const accounts = await readyWeb3.eth.getAccounts()
      readyWeb3.eth.defaultAccount = accounts[0]

      return readyWeb3
    } catch (error) {
      return Promise.reject("User denied account access...")
    }
  }
  // Legacy dapp browsers...
  else if (web3) {
    readyWeb3 = new Web3(web3.currentProvider)
    const accounts = await readyWeb3.eth.getAccounts()
    return readyWeb3
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
