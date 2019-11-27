import {
  DAOConfig,
  DAOMigrationParams,
  Member,
  Scheme,
  SchemeType,
  GenericScheme,
  ContributionReward,
  SchemeRegistrar,
  GenesisProtocol
} from "./dependency/arc";
export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol,
  GenesisProtocolPreset,
  DAOMigrationCallbacks,
  DAOMigrationParams,
  DAOMigrationResult
} from "./dependency/arc";

export type DAOConfig = DAOConfig;
export type Member = Member;
export type Scheme = Scheme;

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
    unregisterOwner: true,
    useUController: false,
    useDaoCreator: true,
    schemes: {},
    VotingMachinesParams: [],
    founders: []
  };

  // schemes & voting machine params
  for (const scheme of schemes) {
    switch (scheme.type) {
      case SchemeType.ContributionReward: {
        if (!params.ContributionReward) {
          params.ContributionReward = [];
        }
        params.ContributionReward.push({
          voteParams: params.VotingMachinesParams.length
        });
        params.schemes.ContributionReward = true;
        break;
      }
      case SchemeType.GenericScheme: {
        const genericScheme = scheme as GenericScheme;
        if (!params.UGenericScheme) {
          params.UGenericScheme = [];
        }
        params.UGenericScheme.push({
          voteParams: params.VotingMachinesParams.length,
          targetContract: genericScheme.contractToCall
        });
        params.schemes.UGenericScheme = true;
        break;
      }
      case SchemeType.SchemeRegistrar: {
        if (!params.SchemeRegistrar) {
          params.SchemeRegistrar = [];
        }
        params.SchemeRegistrar.push({
          voteRegisterParams: params.VotingMachinesParams.length,
          voteRemoveParams: params.VotingMachinesParams.length
        });
        params.schemes.SchemeRegistrar = true;
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

  Object.keys(params.schemes).forEach(type => {
    // TODO: support multiple schemes of a single type
    switch (type) {
      case "ContributionReward":
        if (params.schemes[type]) {
          const config = params.ContributionReward
            ? params.ContributionReward[0]
            : undefined;
          let index;

          if (config && config.voteParams) {
            index = config.voteParams;
          } else {
            index = 0;
          }

          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });
          schemes.push(new ContributionReward(votingMachine));
        }
        break;
      case "UGenericScheme":
        if (params.schemes[type]) {
          const config = params.UGenericScheme
            ? params.UGenericScheme[0]
            : undefined;
          let index;
          let address;

          if (config && config.voteParams) {
            index = config.voteParams;
          } else {
            index = 0;
          }

          if (config && config.targetContract) {
            address = config.targetContract;
          } else {
            address = "0x0000000000000000000000000000000000000000";
          }

          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });

          schemes.push(new GenericScheme(address, votingMachine));
        }
        break;
      case "SchemeRegistrar":
        if (params.schemes[type]) {
          const config = params.SchemeRegistrar
            ? params.SchemeRegistrar[0]
            : undefined;
          let index;

          if (config) {
            if (config.voteRegisterParams) {
              index = config.voteRegisterParams;
            } else if (config.voteRemoveParams) {
              index = config.voteRemoveParams;
            } else {
              index = 0;
            }
          } else {
            index = 0;
          }

          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });

          schemes.push(new SchemeRegistrar(votingMachine));
        }
        break;
      default:
        break;
    }
  });

  return {
    config,
    members,
    schemes
  };
};
