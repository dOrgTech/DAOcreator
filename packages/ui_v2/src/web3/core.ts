import Web3 from "web3";
let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export async function getProvider() {
  if (!web3) {
    try {
      // Request account access if needed
      const account = await (window as any).ethereum.enable();
      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      web3 = new Web3((window as any).ethereum);
      const defaultAccount = account[0];
      web3.eth.defaultAccount = defaultAccount;
      return defaultAccount;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  } else {
    console.log("here");
    const account = await (window as any).ethereum.enable();
    web3 = new Web3((window as any).ethereum);
    const defaultAccount = account[0];
    web3.eth.defaultAccount = defaultAccount;
    return defaultAccount;
  }
}
