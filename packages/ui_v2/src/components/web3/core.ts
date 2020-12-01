import { useState, useEffect } from "react";
import { getWeb3 } from "@dorgtech/daocreator-lib";

export const useActualNetwork = (networks: string[]) => {
  const [actualNetwork, setCurrentNetwork] = useState<string | null>("");

  const setNetwork = async (id: number) => {
    switch (id) {
      case 0:
        setCurrentNetwork(null);
        break;
      case 1:
        setCurrentNetwork("mainnet");
        break;
      case 4:
        setCurrentNetwork("rinkeby");
        break;
      case 100:
        setCurrentNetwork("xdai");
        break;
      default:
        setCurrentNetwork("Not supported");
    }
  };

  // Check network on render
  useEffect(() => {
    (async () => {
      setNetwork(Number(0));
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      setNetwork(Number(networkId));
    })();
  }, []);
  (window as any).ethereum.autoRefreshOnNetworkChange = false;

  (window as any).ethereum.on('connect', (info: any) => {
    console.log(info)
  });


  // Should be implemented by MetaMask soon-tm
  (window as any).ethereum.on("chainChanged", async (chainId: number) => {
    // handle the new network
    setNetwork(Number(chainId));
  });
  return actualNetwork;
};
