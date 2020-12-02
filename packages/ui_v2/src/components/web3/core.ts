import { useState, useEffect } from "react";
import { getWeb3 } from "@dorgtech/daocreator-lib";

export const useActualNetwork = () => {
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

  const ethereum = (window as any).ethereum;

  // Check network on render
  useEffect(() => {
    (async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        setNetwork(Number(networkId));
      } catch (e) {
        setNetwork(Number(0));
      }
    })();
  }, []);

  ethereum.autoRefreshOnNetworkChange = false;

  ethereum.on("accountsChanged", async (account: string) => {
    console.log(ethereum.chainId);
    const network = account.length ? Number(ethereum.chainId) : 0;
    setNetwork(network);
  });

  ethereum.on("chainChanged", async (chainId: number) => {
    setNetwork(Number(chainId));
  });

  ethereum.on("disconnect", async () => {
    setNetwork(0);
  });

  return actualNetwork;
};
