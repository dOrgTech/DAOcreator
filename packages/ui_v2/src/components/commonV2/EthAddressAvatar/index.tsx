import * as React from "react";
import Blockies from "react-blockies";

export type Props = {
  address: string;
};

const EthAddressAvatar: React.SFC<Props> = ({ address }) => (
  <div
    onClick={() => window.open(`https://etherscan.io/address/${address}`)}
    style={{
      padding: 0
    }}
    tabIndex={-1}
  >
    <Blockies seed={address} />
  </div>
);

export default EthAddressAvatar;
