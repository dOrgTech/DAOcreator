const Web3Utils = require('web3-utils')
const Validator = require('jsonschema').Validator
const validator = new Validator()

const requiredNumber = {
  type: 'number',
  required: true
}

const requiredString = {
  type: 'string',
  required: true
}

Validator.prototype.customFormats.address = function (input) {
  const addr = input.toLowerCase()
  return addr[0] === '0' && addr[1] === 'x' && Web3Utils.isAddress(addr)
}

const optionalAddress = {
  anyOf: [
    {
      type: 'string'
    },
    {
      type: 'object',
      minLength: 4
    }
  ]

}

const requiredAddress = {
  ...optionalAddress,
  required: true
}

Validator.prototype.customFormats.permission = function (input) {
  return input[0] === '0' && input[1] === 'x' &&
         input.length === 10 && Web3Utils.isHex(input)
}

const requiredPermission = {
  type: 'string',
  format: 'permission',
  required: true
}

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
    voteOnBehalf: requiredAddress,
    votersReputationLossRatio: requiredNumber,
    activationTime: requiredNumber
  }
}
validator.addSchema(genesisProtocol)

const votingMachineParams = {
  id: 'VotingMachineParams',
  type: 'array',
  items: {
    $ref: 'GenesisProtocol',
    minItems: 1
  }
}
validator.addSchema(votingMachineParams)

const schemes = {
  id: 'SchemeToggles',
  type: 'object',
  properties: {
    ContributionReward: { type: 'boolean' },
    UGenericScheme: { type: 'boolean' },
    SchemeRegistrar: { type: 'boolean' },
    GlobalConstraintRegistrar: { type: 'boolean' },
    UpgradeScheme: { type: 'boolean' }
  }
}
validator.addSchema(schemes)

const contributionReward = {
  id: 'ContributionReward',
  type: 'object',
  properties: {
    voteParams: { type: 'number' },
    votingMachine: optionalAddress
  }
}
validator.addSchema(contributionReward)

const contributionRewards = {
  id: 'ContributionRewards',
  type: 'array',
  items: {
    $ref: 'ContributionReward'
  }
}
validator.addSchema(contributionRewards)

const uGenericScheme = {
  id: 'UGenericScheme',
  type: 'object',
  properties: {
    voteParams: { type: 'number' },
    votingMachine: optionalAddress,
    targetContract: requiredAddress
  }
}
validator.addSchema(uGenericScheme)

const uGenericSchemes = {
  id: 'UGenericSchemes',
  type: 'array',
  items: {
    $ref: 'UGenericScheme'
  }
}
validator.addSchema(uGenericSchemes)

const schemeRegistrar = {
  id: 'SchemeRegistrar',
  type: 'object',
  properties: {
    voteRegisterParams: { type: 'number' },
    voteRemoveParams: { type: 'number' },
    votingMachine: optionalAddress
  }
}
validator.addSchema(schemeRegistrar)

const schemeRegistrars = {
  id: 'SchemeRegistrars',
  type: 'array',
  items: {
    $ref: 'SchemeRegistrar'
  }
}
validator.addSchema(schemeRegistrars)

const globalConstraintRegistrar = {
  id: 'GlobalConstraintRegistrar',
  type: 'object',
  properties: {
    voteParams: { type: 'number' },
    votingMachine: optionalAddress
  }
}
validator.addSchema(globalConstraintRegistrar)

const globalConstraintRegistrars = {
  id: 'GlobalConstraintRegistrars',
  type: 'array',
  items: {
    $ref: 'GlobalConstraintRegistrar'
  }
}
validator.addSchema(globalConstraintRegistrars)

const upgradeScheme = {
  id: 'UpgradeScheme',
  type: 'object',
  properties: {
    voteParams: { type: 'number' },
    votingMachine: optionalAddress
  }
}
validator.addSchema(upgradeScheme)

const upgradeSchemes = {
  id: 'UpgradeSchemes',
  type: 'array',
  items: {
    $ref: 'UpgradeScheme'
  }
}
validator.addSchema(upgradeSchemes)

const customScheme = {
  id: 'CustomScheme',
  type: 'object',
  properties: {
    // TODO: verify this contract exists in either
    // 1. @daostack/arc/build/contracts/${name}.json
    // 2. ${customabilocation}/${name}.json
    name: requiredString,
    alias: requiredString,
    address: optionalAddress,
    fromArc: { type: 'boolean' },
    isUniversal: { type: 'boolean' },
    permissions: requiredPermission,
    // TODO: verify params array entries
    params: { type: 'array' }
  }
}
validator.addSchema(customScheme)

const customSchemes = {
  id: 'CustomSchemes',
  type: 'array',
  items: {
    $ref: 'CustomScheme'
  }
}
validator.addSchema(customSchemes)

const member = {
  id: 'Member',
  type: 'object',
  properties: {
    address: requiredAddress,
    tokens: { type: 'number' },
    reputation: requiredNumber
  }
}
validator.addSchema(member)

const founders = {
  id: 'Founders',
  type: 'array',
  items: {
    $ref: 'Member',
    minItems: 1
  }
}
validator.addSchema(founders)

const paramsSchema = {
  id: 'Params',
  type: 'object',
  properties: {
    orgName: { type: 'string' },
    tokenName: { type: 'string' },
    tokenSymbol: { type: 'string' },
    VotingMachineParams: {
      $ref: 'VotingMachineParams',
      required: true
    },
    schemes: {
      $ref: 'SchemeToggles',
      require: true
    },
    ContributionReward: { $ref: 'ContributionRewards' },
    UGenericScheme: { $ref: 'UGenericSchemes' },
    SchemeRegistrar: { $ref: 'SchemeRegistrars' },
    GlobalConstraintRegistrar: { $ref: 'GlobalConstraintRegistrars' },
    UpgradeScheme: { $ref: 'UpgradeSchemes' },
    CustomSchemes: { $ref: 'CustomSchemes' },
    unregisterOwner: { type: 'boolean' },
    useUController: { type: 'boolean' },
    useDaoCreator: { type: 'boolean' },
    founders: {
      $ref: 'Founders',
      required: true
    },
    // network overrides
    mainnet: { type: 'object' },
    rinkeby: { type: 'object' },
    private: { type: 'object' },
    ropsten: { type: 'object' },
    kovan: { type: 'object' }
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
