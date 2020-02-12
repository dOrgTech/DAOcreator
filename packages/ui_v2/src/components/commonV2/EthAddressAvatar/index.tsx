import React, { FC } from "react";
import makeBlockie from "ethereum-blockies-base64";

export type Props = {
  address: string;
  height?: string;
};

const EthAddressAvatar: FC<Props> = ({ address, height = "30px" }) => (
  <img
    src={makeBlockie(address)}
    alt="identicon"
    onClick={() => window.open(`https://etherscan.io/address/${address}`)}
    style={{
      paddingLeft: "10px"
    }}
    tabIndex={-1}
    height={height}
  />
);

export default EthAddressAvatar;
