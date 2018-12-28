import { Scheme } from "./types"

export const schemes: Scheme[] = [
  {
    typeName: "ContributionReward",
    displayName: "Contribution Reward",
    description:
      "Add the possibility of proposing and rewarding contributions to an organization. An agent can ask to be rewarded with tokens, reputation, or any combination.",
    toggleDefault: true,
  },
  {
    typeName: "VoteInOrganizationScheme",
    displayName: "Vote In Organization",
    description:
      "Add the possibility of creating a proposal for voting on a proposal within another DAO.",
    toggleDefault: true,
  },
  // Currently not available. Is this even  scheme?
  // {
  //   typeName: "DAOCreator",
  //   displayName: "DAO Creator",
  //   description: "Makes it possible for the DAO to create new DAOs.",
  //   toggleDefault: true,
  // },
  {
    typeName: "SimpleICO",
    displayName: "Simple ICO",
    description:
      "Add the possibility of the DAO holding an Initial Coin Offering (ICO).",
    toggleDefault: false,
  },
  {
    typeName: "VestingScheme",
    displayName: "Vesting",
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
    displayName: "Scheme Registrar",
    description:
      " Manages post-creation adding/modifying and removing of features. Schemas are used to add features to a DAO.",
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
