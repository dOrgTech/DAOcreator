import * as R from "ramda";
import Web3 from "../../integrations/web3";

export const SET_DEFAULT_ETH_ADDRESS = "SET_DEFAULT_ETH_ADDRESS";
export const SET_NETWORK_STATUS = "SET_NETWORK_STATUS";

// TODO: Consume the contract ABI->networks here, and make sure the user
// is pointed at a valid network. Default to kovan right now.
const deployedNetworks: number[] = R.map(
  key => parseInt(key),
  [ "42" ],
);

const setDefaultEthAccount = (account: string) => ({
  type: SET_DEFAULT_ETH_ADDRESS,
  account,
});

const setNetwork = (deployedNetworks: number[], currentNetwork: number) => ({
  type: SET_NETWORK_STATUS,
  deployedNetworks,
  currentNetwork,
});

export const fetchDefaultEthAddress = () => async (dispatch: any) => {
  const defaultAccounts = await Web3.eth.getAccounts();
  return dispatch(setDefaultEthAccount(defaultAccounts[0]));
};

export const checkNetwork = () => async (dispatch: any) => {
  try {
    await Web3.eth.net.isListening();
    const currentId = await (Web3 as any).eth.net.getId();
    return dispatch(setNetwork(deployedNetworks, currentId));
  } catch (e) {
    return dispatch(setNetwork(deployedNetworks, -1));
  }
}

export const checkProvider = () => async (dispatch: any) => {
  try {
    await Web3.eth.net.isListening();
  } catch (e) {
    console.log(`Wow. Something went wrong.\n${JSON.stringify(e, null, 2)}`);
  }
}
