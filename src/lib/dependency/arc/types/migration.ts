import { Member, GenesisProtocolConfig } from "./index";
import { TypeConversion } from "lib/dependency/web3";
const { toBN } = TypeConversion;

export interface DAOMigrationParams {
  orgName: string;
  tokenName: string;
  tokenSymbol: string;
  VotingMachinesParams: GenesisProtocolConfig[];
  schemes: {
    ContributionReward?: boolean;
    GenericScheme?: boolean;
    SchemeRegistrar?: boolean;
  };
  ContributionReward?: {
    voteParams?: number;
  };
  GenericScheme?: {
    voteParams?: number;
    targetContract: string;
  };
  SchemeRegistrar?: {
    voteRegisterParams?: number;
    voteRemoveParams?: number;
  };
  unregisterOwner: boolean;
  useUController: boolean;
  useDaoCreator: boolean;
  founders: Member[];
}

export const serialize = (params: DAOMigrationParams): string => {
  params.VotingMachinesParams = params.VotingMachinesParams.map(
    (machineParams: any) => {
      Object.keys(machineParams).map(voting => {
        if (voting !== "voteOnBehalf") {
          return (machineParams[voting] = toBN(
            machineParams[voting]
          ).toNumber());
        } else {
          return (machineParams[voting] = machineParams[voting].toString());
        }
      });
      return machineParams;
    }
  );
  return JSON.stringify(params, null, 2);
};

export const deserialize = (params: string): DAOMigrationParams => {
  const migrationParams = JSON.parse(params);
  migrationParams.VotingMachinesParams = migrationParams.VotingMachinesParams.map(
    (machineParams: any) => {
      Object.keys(machineParams).map(voting => {
        if (voting !== "voteOnBehalf") {
          return (machineParams[voting] = toBN(
            machineParams[voting].toString()
          ));
        } else {
          return (machineParams[voting] = machineParams[voting].toString());
        }
      });
      return machineParams;
    }
  );
  return migrationParams;
};
