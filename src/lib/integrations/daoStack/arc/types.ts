// types exported by this integration

// TODO: clean up the types, define the paradigm for 3 layers of types (UI, LIB, 3rd party)
// - VotingMachine|(Param | Configuration) is a great example of why defining this seperation
//   will be useful. We don't want to bleed UI data into the state (descriptions, display names, etc),
//   but we also want to keep them consistent between tools (GUI, CLI, etc).

export type ParamConfig = {
  [paramName: string]: string | number
}

export type VotingMachineConfiguration = {
  typeName: string
  params: ParamConfig
}

export type VotingMachine = {
  typeName: string
  displayName: string
  description: string
  params: Param[]
  getCallableParamsArray: (config: VotingMachineConfiguration) => any[]
}

export type Param = {
  typeName: string
  valueType: "boolean" | "string" | "number" | "Address" | "BigNumber"
  displayName: string
  description: string
  defaultValue: string | number | boolean
  optional?: boolean
}

export type Founder = {
  address: string
  reputation: string
  tokens: string
}

export type SchemeConfig = {
  id: string
  typeName: string // not schemeTypeName (that is in use now)
  params: ParamConfig & { votingMachineConfig: VotingMachineConfiguration }
}

export type Scheme = {
  typeName: string
  address?: string
  displayName: string
  description: string
  toggleDefault: boolean
  permissions: string
  getCallableParamsArray: (
    schemeConfig: SchemeConfig,
    votingMachineAddress: string,
    votingMachineParametersKey: string
  ) => any[]
  params: Param[]
}

export type DAO = {
  avatar: string
  tokenName: string
  tokenSymbol: string
  name: string
  daoToken: string
  reputation: string
}
