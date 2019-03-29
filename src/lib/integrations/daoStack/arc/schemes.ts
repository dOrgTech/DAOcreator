import { Scheme } from "./types"
import Web3 from "web3"

export const schemes: Scheme[] = [
  {
    typeName: "ContributionReward",
    displayName: "Contributor Rewards",
    description:
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination.",
    toggleDefault: true,
    permissions: "0x00000000" /* no permissions */,
    // TODO: add parameters (orgNativeTokenFeeGWei)
    params: [
      {
        typeName: "orgNativeTokenFeeGWei",
        valueType: "number",
        displayName: "Org Native Token Fee GWei",
        description: "??",
        defaultValue: 0,
      },
    ],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return [
        Web3.utils.toWei(this.params[0].defaultValue.toString(), "gwei"), //TODO: let the user spesify this
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
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
  {
    typeName: "DAOCreator",
    displayName: "DAO Creator",
    description: "Makes it possible for the DAO to create new DAOs.",
    toggleDefault: true,
    permissions: "0x00000000" /* no permissions */,
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return []
    },
  },
  // Currently not available on mainnet
  // {
  //   typeName: "SimpleICO",
  //   displayName: "Initial Coin Offering (ICO)",
  //   description: "DAO run ICOs.",
  //   toggleDefault: false,
  //   permissions: "0x00000000" /* no permissions */,
  // },
  {
    typeName: "VestingScheme",
    displayName: "Token Vesting",
    description: "Add the possibility of creating a token vesting agreement.",
    toggleDefault: false,
    permissions: "0x00000000" /* no permissions */,
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
  {
    typeName: "OrganizationRegister",
    displayName: "Organization Register",
    description:
      "Makes it possible for the DAO to open a registry. Other DAOs can then add and promote themselves on this registry.",
    toggleDefault: false,
    permissions: "0x00000000" /* no permissions */,
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return []
    },
  },
  {
    typeName: "UpgradeScheme",
    displayName: "Upgrade",
    description: "Enables the DAO to upgrade itself.",
    toggleDefault: true,
    permissions: "0x0000000A" /* manage schemes + upgrade controller */,
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
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
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
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
    permissions: "0x00000004" /* manage global constraints */,
    params: [],
    getCallableParamsArray: function(
      votingMachineParametersKey,
      votingMachineAddress
    ) {
      return [votingMachineParametersKey, votingMachineAddress]
    },
  },
]
