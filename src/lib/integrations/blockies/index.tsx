import * as React from "react"
import InBlockies from "react-blockies"
export type Props = {
  address: string
}

const Blockies: React.SFC<Props> = ({ address }) => {
  return <InBlockies seed={address} />
}

export default Blockies
