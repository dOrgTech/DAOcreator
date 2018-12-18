// types exported by this integration

export type VotingMachine = {
  typeName: string
  // TODO: we need an address type...
  universalAddress: string
  // factory: VotingMachineFactory
  displayName: string
  description: string
}

export type Founder = {
  address: string
  reputation: string
  tokens: string
}

export type Schema = any
