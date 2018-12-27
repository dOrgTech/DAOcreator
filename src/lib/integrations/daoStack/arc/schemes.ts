import { Scheme } from "./types"

export const schemes: Scheme[] = [
  {
    typeName: "ContributionReward",
    displayName: "Contribution Reward",
    description:
      "A scheme for proposing and rewarding contributions to an organization. An agent can ask to be rewarded with tokens, reputation, or any combination.",
    toggleDefault: true,
  },
  {
    typeName: "VoteInOrganizationScheme",
    displayName: "Vote In Organization Scheme",
    description:
      "A scheme that generates a new proposal where, if passed, will vote on a proposal within another DAO.",
    toggleDefault: true,
  },
  {
    typeName: "DAOCreator",
    displayName: "DAO Creator",
    description: "A scheme that creates a new DAO.",
    toggleDefault: true,
  },
  {
    typeName: "SimpleICO",
    displayName: "Simple ICO",
    description: "A scheme that holds an ICO that anyone can send funds to.",
    toggleDefault: false,
  },
  {
    typeName: "VestingScheme",
    displayName: "Vesting Scheme",
    description: "A scheme for creating a token vesting agreement.",
    toggleDefault: false,
  },
  {
    typeName: "OrganizationRegister",
    displayName: "Organization Register",
    description:
      "Organizations can use this scheme to open a registry. Other organizations can then add and promote themselves on this registry.",
    toggleDefault: false,
  },
  {
    typeName: "UpgradeScheme",
    displayName: "Upgrade Scheme",
    description: "Enables the DAO to upgrade itself to a new one Controller.",
    toggleDefault: true,
  },
  {
    typeName: "SchemeRegistrar",
    displayName: "Scheme Registrar",
    description: "Manages post-creation Scheme add/modify & removal.",
    toggleDefault: true,
  },
  {
    typeName: "GlobalConstraintRegistrar",
    displayName: "Global Constraint Registrar",
    description: "Manages post-creation Constraint add/modify & removal.",
    toggleDefault: true,
  },
]
