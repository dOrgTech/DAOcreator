import { SchemeDefinition, SchemeConfig, DeploymentInfo } from "./types"
import * as R from "ramda"
import Web3 from "web3"

export const schemeDefinitions: SchemeDefinition[] = [
  {
    typeName: "GenericScheme",
    displayName: "Generic Scheme",
    description:
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar",
    toggleDefault: true,
    permissions: "0x00000010",
    daoCanHaveMultiple: true,
    params: [
      {
        typeName: "contractToCall",
        valueType: "Address",
        displayName: "Contract Address",
        description: "Address of the contract to call",
      },
    ],
    hasVotingMachine: true,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [
        votingMachineParametersKey,
        votingMachineAddress,
        schemeConfig.params.contractToCall,
      ]
    },
  },
  {
    typeName: "ContributionReward",
    displayName: "Contributor Rewards",
    description:
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination.",
    toggleDefault: true,
    permissions: "0x00000000" /* no permissions */,
    params: [],
    daoCanHaveMultiple: false,
    hasVotingMachine: true,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
  {
    typeName: "VoteInOrganizationScheme",
    displayName: "DAO to DAO Voting",
    description:
      "Proposals that, when passed, invoke a vote within another DAO.",
    toggleDefault: true,
    permissions: "0x00000000" /* no permissions */,
    daoCanHaveMultiple: false,
    params: [],
    hasVotingMachine: true,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
  // {
  //   typeName: "DAOCreator",
  //   displayName: "DAO Creator",
  //   description: "Makes it possible for the DAO to create new DAOs.",
  //   toggleDefault: true,
  //   permissions: "0x00000000" /* no permissions */,
  //   params: [],
  //   getCallableParamsArray: function(schemeConfig) {
  //     return []
  //   },
  // },
  // Currently not available on mainnet
  // {
  //   typeName: "SimpleICO",
  //   displayName: "Initial Coin Offering (ICO)",
  //   description: "DAO run ICOs.",
  //   toggleDefault: false,
  //   permissions: "0x00000000" /* no permissions */,
  // },
  // {
  //   typeName: "VestingScheme",
  //   displayName: "Token Vesting",
  //   description: "Add the possibility of creating a token vesting agreement.",
  //   toggleDefault: false,
  //   permissions: "0x00000000" /* no permissions */,
  //   params: [],
  //   getCallableParamsArray: function(
  //     schemeConfig,
  //     votingMachineAddress,
  //     votingMachineParametersKey
  //   ) {
  //     return [votingMachineParametersKey, votingMachineAddress]
  //   },
  // },
  {
    typeName: "OrganizationRegister",
    displayName: "Organization Register",
    description:
      "Makes it possible for the DAO to open a registry. Other DAOs can then add and promote themselves on this registry.",
    toggleDefault: false,
    permissions: "0x00000000" /* no permissions */,
    daoCanHaveMultiple: false,
    params: [
      {
        typeName: "beneficiary",
        valueType: "Address",
        displayName: "Beneficiary (keep empty to set it to the DAO)",
        description:
          "The beneficiary payment address. Keep this field empty to use the DAO as beneficiary.",
        defaultValue: "",
        optional: true,
      },
      {
        typeName: "token",
        valueType: "Address",
        displayName: "Pay Token (keep empty to use the DAO's native token)",
        description:
          "The ERC20 token to pay for register or promotion, an address. Keep this field empty to use tha DAO's notive token.",
        defaultValue: "",
        optional: true,
      },
      {
        typeName: "fee",
        valueType: "number",
        displayName: "Registration Fee",
        description: "Fee for adding something to the register in Wei",
        defaultValue: 100,
      },
    ],
    hasVotingMachine: false,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      let { token, fee, beneficiary } = schemeConfig.params
      if (R.isEmpty(token)) {
        token = deploymentInfo.daoToken
      }
      if (R.isEmpty(beneficiary)) {
        beneficiary = deploymentInfo.avatar
      }
      return [token, fee, beneficiary]
    },
  },
  {
    typeName: "UpgradeScheme",
    displayName: "Upgrade",
    description: "Enables the DAO to upgrade itself.",
    toggleDefault: true,
    permissions: "0x0000000A" /* manage schemes + upgrade controller */,
    daoCanHaveMultiple: false,
    params: [],
    hasVotingMachine: true,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
  {
    typeName: "SchemeRegistrar",
    displayName: "Feature Registrar",
    description:
      "Manages post-creation adding/modifying and removing of features. Features add functionality to the DAO.",
    toggleDefault: true,
    permissions: "0x0000001F" /* all permissions */,
    hasVotingMachine: true,
    daoCanHaveMultiple: false,
    params: [],
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [
        votingMachineParametersKey,
        votingMachineParametersKey,
        votingMachineAddress,
      ]
    },
  },
  {
    typeName: "GlobalConstraintRegistrar",
    displayName: "Global Constraint Registrar",
    description:
      'Makes it possible to add/modify and remove constraints for the DAO. A constraint defines what "cannot be done" in the DAO. For instance, limit the number of tokens that a DAO can create.',
    toggleDefault: true,
    hasVotingMachine: true,
    permissions: "0x00000004" /* manage global constraints */,
    daoCanHaveMultiple: false,
    params: [],
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
]

export const getSchemeDefinition = (typeName: string) =>
  R.find(
    scheme => scheme.typeName === typeName,
    schemeDefinitions
  ) as SchemeDefinition

export const getSchemeCallableParamsArray = (
  schemeConfig: SchemeConfig,
  deploymentInfo: DeploymentInfo
) =>
  getSchemeDefinition(schemeConfig.typeName).getCallableParamsArray(
    schemeConfig,
    deploymentInfo
  )

export const getSchemeDefaultParams = (typeName: string): any => {
  const scheme = getSchemeDefinition(typeName)

  return R.reduce(
    (acc, param) => R.assoc(param.typeName, param.defaultValue, acc),
    {},
    scheme.params
  )
}
