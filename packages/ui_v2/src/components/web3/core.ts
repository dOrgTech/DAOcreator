import Web3 from "web3";
let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export async function getProvider() {
  async function getAccount() {
    const account = await (window as any).ethereum.enable();
    web3 = new Web3((window as any).ethereum);
    const defaultAccount = account[0];
    web3.eth.defaultAccount = defaultAccount;
    return defaultAccount;
  }

  if (!web3) {
    try {
      // Request account access if needed
      return getAccount();
    } catch (error) {
      console.log(error);
      return undefined;
    }
  } else {
    return getAccount();
  }
}
