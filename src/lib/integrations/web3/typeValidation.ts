import Web3 from "web3"

let web3: Web3

export const init = (web3In: Web3) => {
  web3 = web3In
}

export const isAddress = (address: string): boolean => {
  if (web3 == null) {
    throw Error(
      "The web3 object must be set first, by calling the init function."
    )
  } else {
    return web3.utils.isAddress(address)
  }
}
export const isBigNumber = (number: string): boolean => {
  if (web3 == null) {
    throw Error(
      "The web3 object must be set first, by calling the init function."
    )
  } else {
    try {
      web3.utils.toBN(number)
      return true
    } catch {
      return false
    }
  }
}
