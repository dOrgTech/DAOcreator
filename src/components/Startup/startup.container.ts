import { connect } from "react-redux";
import Startup from "./startup";
import { fetchDefaultEthAddress, checkNetwork } from "../../state/actions/web3";

function mapStateToProps(state: any) {
  return {
    correctNetwork: state.web3.correctNetwork,
    deployedNetworks: state.web3.deployedNetworks,
    currentNetwork: state.web3.currentNetwork,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    checkNetwork: () => dispatch(checkNetwork()),
    fetchEthAccount: async () => {
      await dispatch(fetchDefaultEthAddress())
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Startup);
