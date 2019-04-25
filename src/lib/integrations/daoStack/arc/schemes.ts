import { SchemeDefinition, SchemeConfig, DeploymentInfo } from "./types"
import * as R from "ramda"
import Web3 from "web3"

export const schemes: SchemeDefinition[] = [
  {
    typeName: "GenericScheme",
    displayName: "Generic Scheme",
    description:
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar",
    toggleDefault: true,
    permissions: "0x00000010",
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
    params: [
      {
        typeName: "orgNativeTokenFeeGWei",
        valueType: "number",
        displayName: "Org Native Token Fee GWei",
        description: "Fee in GWei:",
        defaultValue: 0,
      },
    ],
    hasVotingMachine: true,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const {
        votingMachineParametersKey,
        votingMachineAddress,
      } = deploymentInfo
      return [
        Web3.utils.toWei(
          schemeConfig.params.orgNativeTokenFeeGWei.toString(),
          "gwei"
        ),
        votingMachineParametersKey,
        votingMachineAddress,
      ]
    },
  },
  {
    typeName: "VoteInOrganizationScheme",
    displayName: "DAO to DAO Voting",
    description:
      "Proposals that, when passed, invoke a vote within another DAO.",
    toggleDefault: true,
    permissions: "0x00000000" /* no permissions */,
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
    params: [
      {
        typeName: "token",
        valueType: "Address",
        displayName: "Pay Token",
        description:
          "The ERC20 token to pay for register or promotion, an address.",
        defaultValue: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359", // DAI. TODO: make this show up nicely in th UI
      },
      {
        typeName: "fee",
        valueType: "number",
        displayName: "Registration Fee",
        description: "Fee for adding something to the register in Wei",
        defaultValue: 100,
      },
      {
        typeName: "beneficiary",
        valueType: "Address",
        displayName: "Beneficiary",
        description: "The beneficiary payment address",
        defaultValue: "",
      },
    ],
    hasVotingMachine: false,
    getCallableParamsArray: function(schemeConfig, deploymentInfo) {
      const { token, fee, beneficiary } = schemeConfig.params
      return [token, fee, beneficiary] // TODO
    },
  },
  {
    typeName: "UpgradeScheme",
    displayName: "Upgrade",
    description: "Enables the DAO to upgrade itself.",
    toggleDefault: true,
    permissions: "0x0000000A" /* manage schemes + upgrade controller */,
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
  R.find(scheme => scheme.typeName === typeName, schemes) as SchemeDefinition

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
