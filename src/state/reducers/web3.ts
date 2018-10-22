import * as R from "ramda";
import { SET_DEFAULT_ETH_ADDRESS, SET_NETWORK_STATUS } from "../actions/web3";

type State = {
  defaultEthAddress: string;
  correctNetwork: boolean;
  deployedNetworks: number[];
  currentNetwork: number;
};

const initialState: State = {
  defaultEthAddress: "",
  correctNetwork: true,
  deployedNetworks: [],
  currentNetwork: -2,
};

export const web3Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_DEFAULT_ETH_ADDRESS:
      return R.merge(state, { defaultEthAddress: action.account });
    case SET_NETWORK_STATUS:
      const { deployedNetworks, currentNetwork } = action;
      return R.merge(state, {
        deployedNetworks,
        currentNetwork,
        correctNetwork: R.contains(currentNetwork, deployedNetworks),
      });
    default:
      return state;
  }
};
