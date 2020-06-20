const Web3Utils = require('web3-utils')
const Validator = require('jsonschema').Validator
const validator = new Validator()

const requiredNumber = {
  type: 'number',
  required: true
}

const requiredInteger = {
  type: 'integer',
  required: true
}

const requiredString = {
  type: 'string',
  required: true
}

Validator.prototype.customFormats.Address = function (input) {
  if (typeof input !== 'string') {
    return false
  }

  const addr = input.toLowerCase()
  return addr[0] === '0' && addr[1] === 'x' && Web3Utils.isAddress(addr)
}

const address = {
  id: 'Address',
  type: 'string',
  format: 'Address'
}
validator.addSchema(address)

Validator.prototype.customFormats.Permissions = function (input) {
  return input[0] === '0' && input[1] === 'x' &&
         input.length === 10 && Web3Utils.isHex(input)
}

const permissions = {
  id: 'Permissions',
  type: 'string',
  format: 'Permissions'
}
validator.addSchema(permissions)

const genesisProtocol = {
  id: 'GenesisProtocol',
  type: 'object',
  properties: {
    boostedVotePeriodLimit: requiredNumber,
    daoBountyConst: requiredNumber,
    minimumDaoBounty: requiredNumber,
    queuedVotePeriodLimit: requiredNumber,
    queuedVoteRequiredPercentage: requiredNumber,
    preBoostedVotePeriodLimit: requiredNumber,
    proposingRepReward: requiredNumber,
    quietEndingPeriod: requiredNumber,
    thresholdConst: requiredNumber,
    voteOnBehalf: { $ref: 'Address', require: true },
    votersReputationLossRatio: requiredNumber,
    activationTime: requiredNumber
  }
}
validator.addSchema(genesisProtocol)

const votingMachineParams = {
  id: 'VotingMachineParams',
  type: 'array',
  items: { $ref: 'GenesisProtocol' },
  minItems: 1
}
validator.addSchema(votingMachineParams)

const packageContract = {
  id: 'PackageContract',
  type: 'object',
  properties: {
    packageContract: requiredString
  }
}
validator.addSchema(packageContract)

Validator.prototype.customFormats.ExternalContractAddress = function (input) {
  return Validator.prototype.customFormats.VotingMachineAddress(input) ||
    input === 'AvatarAddress'
}

const externalContractAddress = {
  id: 'ExternalContractAddress',
  type: 'string',
  format: 'ExternalContractAddress'
}
validator.addSchema(externalContractAddress)

const standAloneIndex = {
  id: 'StandAloneIndex',
  properties: {
    StandAloneContract: {
      ...requiredInteger,
      minimum: 0
    }
  }
}
validator.addSchema(standAloneIndex)

const addressOrStandAlone = {
  id: 'AddressOrStandAlone',
  anyOf: [
    { $ref: 'Address' },
    { $ref: 'StandAloneIndex' }
  ]
}
validator.addSchema(addressOrStandAlone)

Validator.prototype.customFormats.VotingMachineAddress = function (input) {
  return Validator.prototype.customFormats.Address(input) ||
    input === 'GenesisProtocolAddress'
}

const votingMachineAddress = {
  id: 'VotingMachineAddress',
  type: 'string',
  format: 'VotingMachineAddress'
}
validator.addSchema(votingMachineAddress)

const votingMachineParamsIndex = {
  id: 'VotingMachineParamsIndex',
  type: 'object',
  properties: {
    voteParams: {
      ...requiredInteger,
      minimum: 0
    }
  }
}
validator.addSchema(votingMachineParamsIndex)

let schemeNames = []

const addSchemeInitParams = (schemeName, params) => {
  const schema = {
    id: `${schemeName}InitParams`,
    type: 'array',
    items: [
      ...params
    ]
  }
  schema.minItems =
  schema.maxItems = schema.items.length
  validator.addSchema(schema)
}

const addScheme = (schemeName, initParams = [], props = {}) => {
  addSchemeInitParams(schemeName, initParams)

  schemeNames.push(schemeName)

  const schema = {
    id: schemeName,
    type: 'object',
    properties: {
      name: {
        ...requiredString,
        pattern: new RegExp(`^${schemeName}$`)
      },
      permissions: { $ref: 'Permissions', required: true },
      alias: requiredString,
      params: {
        $ref: `${schemeName}InitParams`,
        required: true
      },
      ...props
    }
  }

  validator.addSchema(schema)
}

addScheme(
  'ContributionReward',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' }
  ]
)
addScheme(
  'SchemeRegistrar',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'VotingMachineParamsIndex' }
  ]
)
addScheme(
  'GlobalConstraintRegistrar',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' }
  ]
)
addScheme(
  'UpgradeScheme',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'PackageContract' }
  ]
)
addScheme(
  'GenericScheme',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'ExternalContractAddress' }
  ]
)
addScheme(
  'ContributionRewardExt',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'AddressOrStandAlone' }
  ]
)
addScheme(
  'SchemeFactory',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'PackageContract' }
  ]
)
addScheme(
  'JoinAndQuit',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'Address' },
    requiredInteger,
    requiredInteger,
    requiredInteger,
    requiredInteger
  ]
)
addScheme(
  'FundingRequest',
  [
    { $ref: 'VotingMachineAddress' },
    { $ref: 'VotingMachineParamsIndex' },
    { $ref: 'Address' }
  ]
)

const schemes = {
  id: 'Schemes',
  type: 'array',
  items: {
    anyOf: [
      schemeNames.map(name => ({ $ref: name }))
    ],
    required: [
      'name',
      'alias',
      'permissions',
      'params'
    ]
  }
}
validator.addSchema(schemes)

const member = {
  id: 'Member',
  type: 'object',
  properties: {
    address: { $ref: 'Address', required: true },
    tokens: { type: 'number' },
    reputation: requiredNumber
  }
}
validator.addSchema(member)

const founders = {
  id: 'Founders',
  type: 'array',
  items: { $ref: 'Member' },
  minItems: 1
}
validator.addSchema(founders)

const paramsSchema = {
  id: 'Params',
  type: 'object',
  properties: {
    orgName: { type: 'string' },
    tokenName: { type: 'string' },
    tokenSymbol: { type: 'string' },
    tokenCap: { type: 'number' },
    metaData: { type: 'string' },
    VotingMachineParams: {
      $ref: 'VotingMachineParams',
      required: true
    },
    Schemes: {
      $ref: 'Schemes',
      require: true
    },
    // TODO: implement
    StandAloneContracts: { type: 'any' },
    runFunctions: { type: 'any' },
    founders: {
      $ref: 'Founders',
      required: true
    },
    // network overrides
    mainnet: { type: 'object' },
    rinkeby: { type: 'object' },
    private: { type: 'object' },
    ropsten: { type: 'object' },
    kovan: { type: 'object' },
    xdai: { type: 'object' }
  }
}

function sanitizeParams (paramsJsonObj) {
  const result = validator.validate(paramsJsonObj, paramsSchema)

  if (!result.valid) {
    throw Error(
      `Params Malformed, Errors:\n${result.errors.map(error => error.toString())}`
    )
  }
}

module.exports = sanitizeParams
