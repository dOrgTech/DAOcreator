import { useState, useEffect } from "react";
import { getWeb3 } from "@dorgtech/daocreator-lib";

export const useActualNetwork = () => {
  const [actualNetwork, setCurrentNetwork] = useState("");
  // Check network on render
  useEffect(() => {
    (async () => {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();

      switch (Number(networkId)) {
        case 1:
          setCurrentNetwork("Ethereum Mainnet");
          break;
        case 4:
          setCurrentNetwork("Ethereum Testnet Rinkeby");
          break;
        case 100:
          setCurrentNetwork("xDAI");
          break;
        default:
          setCurrentNetwork("Not supported");
      }
    })();
  }, []);
  // TODO Handle network change (Only Mainnet and Rinkeby are supported)
  (window as any).ethereum.autoRefreshOnNetworkChange = false;

  // Should be implemented by MetaMask soon-tm
  (window as any).ethereum.on("chainChanged", (chainId: number) => {
    // handle the new network
    switch (Number(chainId)) {
      case 1:
        setCurrentNetwork("Ethereum Mainnet");
        break;
      case 4:
        setCurrentNetwork("Ethereum Testnet Rinkeby");
        break;
      case 100:
        setCurrentNetwork("xDAI");
        break;
      default:
        setCurrentNetwork("Not supported");
    }
  });
  return actualNetwork;
};
