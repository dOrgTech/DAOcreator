// types exported by this integration

export type VotingMachine = {
  typeName: string
  displayName: string
  description: string
  params: VotingMachineParam[]
}

export type VotingMachineParam = {
  typeName: string
  valueType: "boolean" | "string" | "number" | "Address" | "BigNumber"
  displayName: string
  description: string
  defaultValue: string | number | boolean
}

export type Founder = {
  address: string
  reputation: string
  tokens: string
}

export type Schema = {
  typeName: string
  address?: string
  displayName: string
  description: string
}

export type DAO = {
  avatarAddress: string
  controllerAddress: string
  tokenName: string
  tokenSymbol: string
  name: string
}
