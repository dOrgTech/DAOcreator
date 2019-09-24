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

export interface DAOMigrationCallbacks {
  userApproval: (msg: string) => Promise<boolean>;
  info: (msg: string) => void;
  error: (err: string) => void;
  txComplete: (msg: string, txHash: string, txCost: number) => Promise<void>;
  migrationAborted: (msg: string) => void;
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
const bnProps = new Set([
  "queuedVoteRequiredPercentage",
  "queuedVotePeriodLimit",
  "thresholdConst",
  "proposingRepReward",
  "minimumDaoBounty",
  "boostedVotePeriodLimit",
  "daoBountyConst",
  "activationTime",
  "preBoostedVotePeriodLimit",
  "quietEndingPeriod",
  "votersReputationLossRatio"
]);

export const fromJSON = (params: string): DAOMigrationParams => {
  const receiver = (key: string, value: any) => {
    if (bnProps.has(key)) {
      return TypeConversion.toBN(value);
    } else {
      return value;
    }
  };

  return JSON.parse(params, receiver);
};
