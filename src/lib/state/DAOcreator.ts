import {
  DAOConfig,
  DAOMigrationParams,
  Member,
  Scheme,
  SchemeType,
  GenericScheme,
  ContributionReward,
  SchemeRegistrar,
  GenesisProtocol,
  deserialize
} from "lib/dependency/arc";
import { DAOForm } from "lib/forms";
import { TypeConversion } from "lib/dependency/web3";
export {
  SchemeType,
  ContributionReward,
  SchemeRegistrar,
  GenericScheme,
  GenesisProtocol
} from "lib/dependency/arc";

const toBN = TypeConversion.toBN;

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
        params.ContributionReward = {
          voteParams: params.VotingMachinesParams.length
        };
        params.schemes.ContributionReward = true;
        break;
      }
      case SchemeType.GenericScheme: {
        const genericScheme = scheme as GenericScheme;
        params.GenericScheme = {
          voteParams: params.VotingMachinesParams.length,
          targetContract: genericScheme.contractToCall
        };
        params.schemes.GenericScheme = true;
        break;
      }
      case SchemeType.SchemeRegistrar: {
        params.SchemeRegistrar = {
          voteRegisterParams: params.VotingMachinesParams.length,
          voteRemoveParams: params.VotingMachinesParams.length
        };
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
      tokens: toBN(member.tokens),
      reputation: toBN(member.reputation)
    });
  }

  // schemes
  let schemes: Scheme[] = [];

  Object.keys(params.schemes).forEach(type => {
    switch (type) {
      case "ContributionReward":
        if (params.schemes[type]) {
          let index = params.ContributionReward
            ? params.ContributionReward["voteParams"]
            : 0;

          if (index === undefined) {
            index = 0;
          }

          const votingMachine = new GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });
          schemes.push(new ContributionReward(votingMachine));
        }
        break;
      case "GenericScheme":
        if (params.schemes[type]) {
          let index = params.GenericScheme
            ? params.GenericScheme["voteParams"]
            : 0;
          let address = params.GenericScheme
            ? params.GenericScheme["targetContract"]
            : "0x0000000000000000000000000000000000000000";

          if (index === undefined) {
            index = 0;
          }
          if (address === undefined) {
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
          let index = params.SchemeRegistrar
            ? params.SchemeRegistrar["voteRegisterParams"]
            : 0;

          if (index === undefined) {
            index = params.SchemeRegistrar
              ? params.SchemeRegistrar["voteRemoveParams"]
              : 0;
            index = index ? index : 0;
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

export const importParams = (form: DAOForm, params: string) => {
  return new Promise((resolve, reject) => {
    try {
      const daoParams: DAOMigrationParams = deserialize(params);
      form.fromState(fromDAOMigrationParams(daoParams));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
