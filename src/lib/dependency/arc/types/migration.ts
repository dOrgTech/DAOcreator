import { Member, GenesisProtocolConfig } from "./index";
import { TypeConversion, TypeValidation } from "lib/dependency/web3";

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

export const toJSON = (params: DAOMigrationParams): string => {
  // convert all BN values to numbers
  for (let config of params.VotingMachinesParams) {
    Object.keys(config).forEach(key => {
      const value = (config as any)[key];
      if (TypeValidation.isBN(value)) {
        (config as any)[key] = value.toNumber();
      }
    });
  }

  return JSON.stringify(params, null, 2);
};

// Used to detect what property names are of type BN.
// See below.
const bn0 = TypeConversion.toBN(0);
const dummyInstance: GenesisProtocolConfig = {
  queuedVoteRequiredPercentage: bn0,
  queuedVotePeriodLimit: bn0,
  thresholdConst: bn0,
  proposingRepReward: bn0,
  minimumDaoBounty: bn0,
  boostedVotePeriodLimit: bn0,
  daoBountyConst: bn0,
  activationTime: bn0,
  preBoostedVotePeriodLimit: bn0,
  quietEndingPeriod: bn0,
  voteOnBehalf: "0x",
  votersReputationLossRatio: bn0
};

export const fromJSON = (params: string): DAOMigrationParams => {
  const receiver = (key: string, value: any) => {
    const testValue = (dummyInstance as any)[key];
    if (testValue && TypeValidation.isBN(testValue)) {
      return TypeConversion.toBN(value);
    } else {
      return value;
    }
  };

  return JSON.parse(params, receiver);
};
