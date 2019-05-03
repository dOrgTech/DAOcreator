import * as typeValidation from "./typeValidation"
import Web3 from "web3"

let readyWeb3: Web3

export const getWeb3 = async (): Promise<any> => {
  if (readyWeb3 != null) {
    const accounts = await readyWeb3.eth.getAccounts()
    readyWeb3.eth.defaultAccount = accounts[0]
    return readyWeb3
  }
  const ethereum = (window as any).ethereum
  const web3 = (window as any).web3

  if (ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable()

      // Acccounts now exposed
      readyWeb3 = new Web3(ethereum, undefined, {
        transactionConfirmationBlocks: 1,
      })
      const accounts = await readyWeb3.eth.getAccounts()
      readyWeb3.eth.defaultAccount = accounts[0]
    } catch (error) {
      return Promise.reject("User denied account access...")
    }
  }
  // Legacy dapp browsers...
  else if (web3) {
    readyWeb3 = new Web3(web3.currentProvider, undefined, {
      transactionConfirmationBlocks: 1,
    })
    const accounts = await readyWeb3.eth.getAccounts()
    readyWeb3.eth.defaultAccount = accounts[0]
  }
  // Non-dapp browsers...
  else {
    return Promise.reject(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    )
  }
  typeValidation.init(readyWeb3)
  return readyWeb3
}

export const TypeValidation = typeValidation
