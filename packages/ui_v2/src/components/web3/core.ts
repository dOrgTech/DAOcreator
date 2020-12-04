import { useState, useEffect } from "react";
import { getWeb3 } from "@dorgtech/daocreator-lib";

type Network = {
  [id: number]: string;
};

const KNOWN_NETWORKS: Network = {
  1: "mainnet",
  4: "rinkeby",
  42: "kovan",
  100: "xdai"
};

export const useActualNetwork = (acceptedNetworks: string[]) => {
  const [actualNetwork, setCurrentNetwork] = useState<string | null>("");
  const setNetwork = async (id: number) => {
    const network = KNOWN_NETWORKS[id];
    if (network && acceptedNetworks.includes(network)) {
      setCurrentNetwork(network);
      return;
    }
    setCurrentNetwork("Unknown");
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
