/*
 * The following is covered under the lib
 */

// import Web3 from "web3";
// let web3: Web3 | undefined = undefined; // Will hold the web3 instance

// export async function enableEthereum() {
//   async function getAccount() {
//     const account = await (window as any).ethereum.enable();
//     web3 = new Web3((window as any).ethereum);
//     const defaultAccount = account[0];
//     web3.eth.defaultAccount = defaultAccount;
//     return defaultAccount;
//   }

//   if (!web3) {
//     try {
//       // Request account access if needed
//       return getAccount();
//     } catch (error) {
//       console.log(error);
//       return undefined;
//     }
//   } else {
//     return getAccount();
//   }
// }

export const handleNetworkReload = async () => {
  try {
    // TODO Handle network change (Only Mainnet and Rinkeby are supported)
    (window as any).ethereum.autoRefreshOnNetworkChange = false;

    // Should be implemented by MetaMask soon-tm
    (window as any).ethereum.on("chainChanged", (chainId: number) => {
      // handle the new network
      console.log("Current chain: " + chainId);
      return null;
    });

    (window as any).ethereum.on("networkChanged", (networkId: string) => {
      // networkId goes from "loading" to the network id (different to chain id)
      console.log("Current chain: " + networkId);
      return null;
    });
  } catch (e) {
    console.log(e);
  }
};
