import {
  DAOConfig as ArcDAOConfig,
  DAOMigrationParams,
  Member as ArcMember,
  ProposalScheme as ArcScheme,
  SchemeType,
  GenericScheme,
  ContributionReward,
  SchemeFactory,
  GenesisProtocol
} from "./dependency/arc";
export {
  SchemeType,
  ContributionReward,
  SchemeFactory,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset,
  DAOMigrationCallbacks,
  DAOMigrationParams,
  DAOMigrationResult
} from "./dependency/arc";

export type DAOConfig = ArcDAOConfig;
export type Member = ArcMember;
export type Scheme = ArcScheme;

export interface DAOcreatorState {
  config: DAOConfig;
  members: Member[];
  schemes: Scheme[];
}

export const toDAOMigrationParams = (
  dao: DAOcreatorState
): DAOMigrationParams => {
  const { config, members, schemes } = dao;
  const params: DAOMigrationParams = {
    orgName: config.daoName,
    tokenName: config.tokenName,
    tokenSymbol: config.tokenSymbol,
    VotingMachinesParams: [],
    Schemes: [],
    StandAloneContracts: [],
    founders: []
  };

  // TODO: generalize to a single loop, no switch. Have each scheme add itself?
  // schemes & voting machine params
  for (const scheme of schemes) {
    switch (scheme.type) {
      case SchemeType.ContributionReward: {
        params.Schemes.push({
          name: "ContributionReward",
          alias: "",
          permissions: scheme.permissions,
          params: [
            "GenesisProtocolAddress",
            { voteParams: params.VotingMachinesParams.length }
          ]
        });
        break;
      }
      case SchemeType.GenericScheme: {
        const gs = scheme as GenericScheme
        params.Schemes.push({
          name: "GenericScheme",
          alias: "",
          permissions: scheme.permissions,
          params: [
            "GenesisProtocolAddress",
            { voteParams: params.VotingMachinesParams.length },
            gs.contractToCall
          ]
        });
        break;
      }
      case SchemeType.SchemeFactory: {
        params.Schemes.push({
          name: "SchemeFactory",
          alias: "",
          permissions: scheme.permissions,
          params: [
            "GenesisProtocolAddress",
            { voteParams: params.VotingMachinesParams.length },
            { packageContract: "DAOFactoryInstance" }
          ]
        });
        break;
      }
    }

    const genProtocol = scheme.votingMachine as GenesisProtocol;
    params.VotingMachinesParams.push(genProtocol.config);
  }

  for (const member of members) {
    params.founders.push(member);
  }

  return params;
};

export const fromDAOMigrationParams = (
  params: DAOMigrationParams
): DAOcreatorState => {
  // config
  const config: DAOConfig = {
    daoName: params.orgName,
    tokenSymbol: params.tokenSymbol,
    tokenName: params.tokenName
  };

  // members
  let members: Member[] = [];

  for (const member of params.founders) {
    members.push({
      address: member.address,
      tokens: member.tokens ? member.tokens : 0,
      reputation: member.reputation
    });
  }

  // schemes
  let schemes: Scheme[] = [];

  if (params.Schemes) {
    for (const scheme of params.Schemes) {
      switch (scheme.name) {
        case "ContributionReward": {
          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[scheme.params[1].voteParams]
          });
          schemes.push(new ContributionReward(votingMachine));
          break;
        }
        case "GenericScheme": {
          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[scheme.params[1].voteParams]
          });
          schemes.push(new GenericScheme(scheme.params[2], votingMachine));
          break;
        }
        case "SchemeFactory": {
          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[scheme.params[1].voteParams]
          });
          schemes.push(new SchemeFactory(votingMachine));
          break;
        }
        default:
          break;
      }
    }
  }

  return {
    config,
    members,
    schemes
  };
};