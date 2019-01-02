export default (web3: any) => ({
  isAddress: (address: string): boolean => {
    return web3.utils.isAddress(address)
  },

  isBigNumber: (number: string): boolean => {
    try {
      web3.utils.toBN(number)
      return true
    } catch {
      return false
    }
  },
})
