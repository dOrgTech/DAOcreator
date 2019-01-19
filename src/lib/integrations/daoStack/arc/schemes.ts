import { Scheme } from "./types"

export const schemes: Scheme[] = [
  {
    typeName: "ContributionReward",
    displayName: "Contributor Rewards",
    description:
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination.",
    toggleDefault: true,
  },
  {
    typeName: "VoteInOrganizationScheme",
    displayName: "DAO to DAO Voting",
    description:
      "Proposals that, when passed, invoke a vote within another DAO.",
    toggleDefault: true,
  },
  // Currently not available.
  // https://daostack.github.io/arc/generated_docs/universalSchemes/DAOcreator/
  // {
  //   typeName: "DAOCreator",
  //   displayName: "DAO Creator",
  //   description: "Makes it possible for the DAO to create new DAOs.",
  //   toggleDefault: true,
  // },
  {
    typeName: "SimpleICO",
    displayName: "Initial Coin Offering (ICO)",
    description: "DAO run ICOs.",
    toggleDefault: false,
  },
  {
    typeName: "VestingScheme",
    displayName: "Token Vesting",
    description: "Add the possibility of creating a token vesting agreement.",
    toggleDefault: false,
  },
  {
    typeName: "OrganizationRegister",
    displayName: "Organization Register",
    description:
      "Makes it possible for the DAO to open a registry. Other DAOs can then add and promote themselves on this registry.",
    toggleDefault: false,
  },
  {
    typeName: "UpgradeScheme",
    displayName: "Upgrade",
    description: "Enables the DAO to upgrade itself.",
    toggleDefault: true,
  },
  {
    typeName: "SchemeRegistrar",
    displayName: "Feature Registrar",
    description:
      "Manages post-creation adding/modifying and removing of features. Features add functionality to the DAO.",
    toggleDefault: true,
  },
  {
    typeName: "GlobalConstraintRegistrar",
    displayName: "Global Constraint Registrar",
    description:
      'Makes it possible to add/modify and remove constraints for the DAO. A constraint defines what "cannot be done" in the DAO. For instance, limit the number of tokens that a DAO can create.',
    toggleDefault: true,
  },
]
