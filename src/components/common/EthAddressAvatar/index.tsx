import * as React from "react";
import { IconButton } from "@material-ui/core";
import Blockies from "react-blockies";

export type Props = {
  address: string;
};

const EthAddressAvatar: React.SFC<Props> = ({ address }) => (
  <IconButton
    onClick={() => window.open(`https://etherscan.io/address/${address}`)}
    style={{
      padding: 0
    }}
    tabIndex={-1}
  >
    <Blockies seed={address} />
  </IconButton>
);

export default EthAddressAvatar;
