import { DAOcreatorState } from "../../state";
import { SchemeType, GenericScheme, GenesisProtocol } from "./types";

export * from "./types";
/*export * from "./votingMachines";

export const init = async (web3: any) => {
  const network: string = await web3.eth.net.getNetworkType();
  const supportedNetworks = R.keys(deployedContractAddresses);

  if ((deployedContractAddresses as any)[network] != null) {
    return;
  } else {
    throw Error(
      "Network not supported. The supported network are: " +
        supportedNetworks.toString()
    );
  }
};

export const createDao = (
  web3: any,
  waitingDetailsUpdater: (message: string) => void
) => async (
  config: DAOConfig,
  members: Member[],
  schemes: SchemeConfig[]
): Promise<DAO> => {
  try {
    const network: string = await web3.eth.net.getNetworkType();
    const newDao = await createTheDao(
      web3,
      waitingDetailsUpdater,
      (deployedContractAddresses as any)[network],
      config,
      members,
      schemes
    );
    console.log("DAO created");
    console.log(newDao);

    return newDao;
  } catch (e) {
    console.log("Error while deploying DAO:");
    console.error(e);
    return Promise.reject(e);
  }
};

export const initSchemeConfig = (
  id: string = uuid(),
  typeName: string = "",
  params: any = {}
): SchemeConfig => {
  return {
    id,
    typeName,
    params
  };
};
*/

// TODO: refine the types for DAO in arc/types
export const serializeDAO = (dao: DAOcreatorState): string => {
  const { config, members, schemes } = dao;
  let json: any = {};

  // names
  json.orgName = config.daoName;
  json.tokenName = config.tokenName;
  json.tokenSymbol = config.tokenSymbol;

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
