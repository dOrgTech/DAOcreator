import { DAOcreatorState } from "lib/state";
import { SchemeType, GenericScheme, GenesisProtocol } from "./types";

export * from "./types";

// TODO: refine the types for DAO in arc/types
export const serializeDAO = (dao: DAOcreatorState): string => {
  const { config, members, schemes } = dao;
  let json: any = {};

  // names
  json.orgName = config.daoName;
  if (config.tokenName) {
    json.tokenName = config.tokenName;
    json.tokenSymbol = config.tokenSymbol;
  } else {
    json.daoSymbol = config.daoSymbol;
  }

  json.VotingMachinesParams = [];
  json.schemes = {};

  // schemes & voting machine params
  for (const scheme of schemes) {
    switch (scheme.type) {
      case SchemeType.ContributionReward: {
        json["ContributionReward"] = {
          voteParams: json.VotingMachinesParams.length
        };
        json.schemes.ContributionReward = true;
        break;
      }
      case SchemeType.GenericScheme: {
        const genericScheme = scheme as GenericScheme;
        json["GenericScheme"] = {
          voteParams: json.VotingMachinesParams.length,
          targetContract: genericScheme.contractToCall
        };
        json.schemes.GenericScheme = true;
        break;
      }
      case SchemeType.SchemeRegistrar: {
        json["SchemeRegistrar"] = {
          voteRegisterParams: json.VotingMachinesParams.length,
          voteRemoveParams: json.VotingMachinesParams.length
        };
        json.schemes.SchemeRegistrar = true;
        break;
      }
    }

    const genProtocol = scheme.votingMachine as GenesisProtocol;
    const config = genProtocol.config;
    let protocolParams: any = {};

    for (const key in config) {
      const value = (config as any)[key];

      if (typeof value === "string") {
        protocolParams[key] = value;
      } else {
        // BN
        protocolParams[key] = value.toNumber();
      }
    }

    json.VotingMachinesParams.push(protocolParams);
  }

  // settings
  json.unregisterOwner = true;
  json.useUController = true;
  json.useDaoCreator = true;

  // members
  json.founders = [];

  for (const member of members) {
    json.founders.push({
      address: member.address,
      tokens: member.tokens.toNumber(),
      reputation: member.reputation.toNumber()
    });
  }

  return JSON.stringify(json, null, 2);
};
