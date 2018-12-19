import { VotingMachine } from "./types"

export const votingMachines: VotingMachine[] = [
  {
    typeName: "AbsoluteVote",
    // TODO: where to get? This really makes me think about better data driven development
    // for these apps... what should be registry driven and what should be baked into the app?
    // Maybe knowns baked, and new ones grabbed from registry?
    universalAddress: "0xTODO",
    displayName: "Absolute Vote",
    description: "Absolute Vote: useful description TODO",
  },
  {
    typeName: "GenesisProtocol",
    universalAddress: "0xTODO",
    displayName: "Genesis Protocol",
    description: "Genesis Protocol: useful description TODO",
  },
]
