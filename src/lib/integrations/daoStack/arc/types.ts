// types exported by this integration

// TODO: clean up the types, define the paradigm for 3 layers of types (UI, LIB, 3rd party)
// - VotingMachine|(Param | Configuration) is a great example of why defining this seperation
//   will be useful. We don't want to bleed UI data into the state (descriptions, display names, etc),
//   but we also want to keep them consistent between tools (GUI, CLI, etc).

export type ParamConfig = {
  [paramName: string]: string | number
}

export type VotingMachineConfig = {
  typeName: string
  params: ParamConfig
}

export type VotingMachineDefinition = {
  typeName: string
  displayName: string
  description: string
  params: ParamDefinition[]
  getCallableParamsArray: (config: VotingMachineConfig) => any[]
}

export type ParamDefinition = {
  typeName: string
  valueType: "boolean" | "string" | "number" | "Address" | "BigNumber"
  displayName: string
  description: string
  defaultValue?: string | number | boolean
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
  votingMachineConfig?: VotingMachineConfig
  params: ParamConfig
}

export type SchemeDefinition = {
  typeName: string
  address?: string
  displayName: string
  description: string
  toggleDefault: boolean
  permissions: string
  hasVotingMachine: boolean
  getCallableParamsArray: (
    schemeConfig: SchemeConfig,
    deploymentInfo: DeploymentInfo
  ) => any[]
  params: ParamDefinition[]
}

export type DAO = {
  avatar: string
  tokenName: string
  tokenSymbol: string
  name: string
  daoToken: string
  reputation: string
}

export type DeploymentInfo = {
  avatar: string // address
  daoToken: string // address
  reputation: string // address
  votingMachineParametersKey?: string // hash
  votingMachineAddress?: string // address
}
