import * as React from "react"
import Blockies from "react-blockies"

export type Props = {
  address: string
}

const EthAddressAvatar: React.SFC<Props> = ({ address }) => {
  return <Blockies seed={address} />
}

export default EthAddressAvatar
