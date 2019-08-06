import { FieldState, FormState, ValidatableMapOrArray } from "formstate";
import {
  requiredText,
  validAddress,
  validBigNumber,
  validTokenSymbol,
  validName,
  requireElement,
  noDuplicates,
  validPercentage,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  nonZeroAddress
} from "./validators";
import {
  DAOcreatorState,
  DAOConfig,
  Member,
  GenesisProtocol,
  Scheme,
  GenericScheme,
  ContributionReward,
  SchemeRegistrar
} from "../state";
import { TypeConversion } from "../dependency/web3";
import { SchemeType } from "../dependency/arc";
const { toBN, toWei, fromWei } = TypeConversion;

export class FriendlyField<T> extends FieldState<T> {
  private _description: string = "";
  private _displayName: string = "";
  private _story: string = "";

  setDescription(description: string): FriendlyField<T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): FriendlyField<T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }

  setStory(story: string): FriendlyField<T> {
    this._story = story;
    return this;
  }

  get story(): string {
    return this._story;
  }
}

export type StringField = FriendlyField<string>;

export class FriendlyForm<
  StateType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  private _description: string = "";
  private _displayName: string = "";
  public toState: () => StateType;
  public fromState: (state: StateType) => void;

  constructor(
    $: T,
    toState: () => StateType,
    fromState: (state: StateType) => void
  ) {
    super($);
    this.toState = toState.bind(this);
    this.fromState = fromState.bind(this);
  }

  setDescription(description: string): FriendlyForm<StateType, T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): FriendlyForm<StateType, T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }
}

export type DAOForm = FriendlyForm<
  DAOcreatorState,
  {
    config: DAOConfigForm;
    members: MembersForm;
    schemes: SchemesForm;
  }
>;

export const CreateDAOForm = (form?: DAOForm): DAOForm =>
  new FriendlyForm(
    {
      config: CreateDAOConfigForm(form ? form.$.config : undefined),
      members: CreateMembersForm(form ? form.$.members : undefined),
      schemes: CreateSchemesForm(form ? form.$.schemes : undefined)
    },
    function(this: DAOForm): DAOcreatorState {
      return {
        config: this.$.config.toState(),
        members: this.$.members.toState(),
        schemes: this.$.schemes.toState()
      };
    },
    function(this: DAOForm, state: DAOcreatorState): void {
      this.$.config.fromState(state.config);
      this.$.members.fromState(state.members);
      this.$.schemes.fromState(state.schemes);
    }
  );

export type DAOConfigForm = FriendlyForm<
  DAOConfig,
  {
    daoName: StringField;
    tokenName: StringField;
    tokenSymbol: StringField;
  }
>;

export const CreateDAOConfigForm = (form?: DAOConfigForm): DAOConfigForm =>
  new FriendlyForm(
    {
      daoName: new FriendlyField(form ? form.$.daoName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("DAO Name")
        .setDescription("The name of the DAO."),

      tokenName: new FriendlyField(form ? form.$.tokenName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("Token Name")
        .setDescription("The name of the DAO's token."),

      tokenSymbol: new FriendlyField(form ? form.$.tokenSymbol.value : "")
        .validators(requiredText, validTokenSymbol)
        .setDisplayName("Token Symbol")
        .setDescription("The token's 4 letter symbol for exchanges.")
    },
    function(this: DAOConfigForm): DAOConfig {
      return {
        daoName: this.$.daoName.value,
        tokenName: this.$.tokenName.value,
        tokenSymbol: this.$.tokenSymbol.value
      };
    },
    function(this: DAOConfigForm, state: DAOConfig): void {
      this.$.daoName.value = state.daoName;
      this.$.tokenName.value = state.tokenName;
      this.$.tokenSymbol.value = state.tokenSymbol;
    }
  );

export type MembersForm = FriendlyForm<Member[], MemberForm[]>;

export const CreateMembersForm = (form?: MembersForm): MembersForm =>
  new FriendlyForm(
    form ? form.$.map(value => value) : ([] as MemberForm[]),
    function(this: MembersForm): Member[] {
      return this.$.map((member: MemberForm): Member => member.toState());
    },
    function(this: MembersForm, state: Member[]): void {
      this.$ = state.map(member => {
        const memberForm = CreateMemberForm();
        memberForm.fromState(member);
        return memberForm;
      });
    }
  )
    .validators(requireElement("Member"))
    .validators(
      noDuplicates(
        (a: MemberForm, b: MemberForm) =>
          a.$.address.value === b.$.address.value
      )
    );

export type MemberForm = FriendlyForm<
  Member,
  {
    address: StringField;
    reputation: StringField;
    tokens: StringField;
  }
>;

export const CreateMemberForm = (form?: MemberForm): MemberForm =>
  new FriendlyForm(
    {
      address: new FriendlyField(form ? form.$.address.value : "")
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Address")
        .setDescription("The member's public address."),

      reputation: new FriendlyField(form ? form.$.reputation.value : "")
        .validators(requiredText, validBigNumber)
        .setDisplayName("Reputation")
        .setDescription(
          "The member's reputation (voting power) within the DAO."
        ),

      tokens: new FriendlyField(form ? form.$.tokens.value : "")
        .validators(requiredText, validBigNumber)
        .setDisplayName("Tokens")
        .setDescription("The number of DAO tokens this member owns.")
    },
    function(this: MemberForm): Member {
      return {
        address: this.$.address.value,
        tokens: toBN(this.$.tokens.value),
        reputation: toBN(this.$.reputation.value)
      };
    },
    function(this: MemberForm, state: Member): void {
      this.$.address.value = state.address;
      this.$.reputation.value = state.reputation.toString();
      this.$.tokens.value = state.tokens.toString();
    }
  );

export type GenesisProtocolForm = FriendlyForm<
  GenesisProtocol,
  {
    queuedVoteRequiredPercentage: StringField;
    queuedVotePeriodLimit: StringField;
    thresholdConst: StringField;
    proposingRepReward: StringField;
    minimumDaoBounty: StringField;
    boostedVotePeriodLimit: StringField;
    daoBountyConst: StringField;
    activationTime: StringField;
    preBoostedVotePeriodLimit: StringField;
    quietEndingPeriod: StringField;
    voteOnBehalf: StringField;
    votersReputationLossRatio: StringField;
  }
>;

// TODO: support better fields (percentages, Day/Hour/Seconds, gwei, numbers [min, max])
export const CreateGenesisProtocolForm = (
  form?: GenesisProtocolForm
): GenesisProtocolForm =>
  new FriendlyForm(
    {
      queuedVotePeriodLimit: new FriendlyField(
        form ? form.$.queuedVotePeriodLimit.value : "1800"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Queued Vote Period Limit")
        .setDescription(
          "The length of time that voting is open for non-boosted proposals."
        )
        .setStory(
          "All proposals start out in the regular queue, where they require an absolute majority of support to pass or to fail. This parameter controls how long the DAO has to vote on a non-boosted proposal, so the longer it is, the more votes a given proposal is likely to accrue during its voting period. A longer voting period, however, also means the DAO will process proposals more slowly."
        ),

      preBoostedVotePeriodLimit: new FriendlyField(
        form ? form.$.preBoostedVotePeriodLimit.value : "1814400"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Pre-Boosted Vote Period Limit")
        .setDescription(
          "The length of time that a proposal must maintain a confidence score higher than the boosting threshold to become eligible for boosting."
        )
        .setStory(
          "If a proposal has received enough stake predicting its success to become boosted, it first has to go through this pending period, to ensure there’s a chance for predictors to downstake it. This improves the staking/boosting system’s prediction accuracy and resilience to malicious actions."
        ),

      boostedVotePeriodLimit: new FriendlyField(
        form ? form.$.boostedVotePeriodLimit.value : "259200"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Boosted Vote Period Limit")
        .setDescription(
          "The length of time that voting is open for boosted proposals."
        )
        .setStory(
          "Proposals can only become boosted by gaining high confidence scores (lots of predictions that they will succeed), and so boosted proposals are “fast-tracked”: they require no minimum quorum of voters and have a shorter voting time period than non-boosted proposals."
        ),

      // TODO: make all of these Day/Hour/Second selectors
      quietEndingPeriod: new FriendlyField(
        form ? form.$.quietEndingPeriod.value : "86400"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Quiet Ending Period")
        .setDescription(
          "The length of time a vote’s potential result needs to stay the same in order to be confirmed as the official result."
        )
        .setStory(
          "Holding votes until the last second of a voting period is not good for collective intelligence, and the quiet ending period helps get rid of it. If a vote switches from yes to no, or vice versa, near the end of the voting time (during it’s quiet ending period), extra voting time (another quiet ending period) is added."
        ),

      queuedVoteRequiredPercentage: new FriendlyField(
        form ? form.$.queuedVoteRequiredPercentage.value : "50"
      )
        .validators(requiredText, validPercentage)
        .setDisplayName("Queued Vote Required Percentage")
        .setDescription(
          "The quorum required to decide a vote on a non-boosted proposal."
        )
        .setStory(
          "We think of non-boosted proposals as requiring more than 50% of a DAO’s voting power to decide, but this percentage is actually adjustable as well. Some DAOs may want to require a supermajority such as 60% and others, realizing how unlikely reaching 50% consensus is given participation rates, may want a lower quorum."
        ),

      minimumDaoBounty: new FriendlyField(
        form ? form.$.minimumDaoBounty.value : "100"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Minimum DAO Bounty")
        .setDescription(
          "The minimum amount of GEN a DAO will stake when automatically downstaking each proposal."
        )
        .setStory(
          "The DAO will automatically downstake every proposal, in order to properly set up the staking system, and this parameter sets the minimum size for that downstake. A higher minimum means the DAO is more heavily subsidizing staking."
        ),

      daoBountyConst: new FriendlyField(
        form ? form.$.daoBountyConst.value : "75"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("DAO Bounty Const")
        .setDescription(
          "This is multiplied by the average downstake on boosted proposals to calculate how large the DAO’s automatic downstake should be."
        )
        .setStory(
          "A size coefficient of 1 will mean the DAO automatically downstakes new proposal with a downstake as large as the average downstake on boosted proposals (unless that would be smaller than the minimum DAOstake parameter!)."
        ),

      thresholdConst: new FriendlyField(
        form ? form.$.thresholdConst.value : "2000"
      )
        .validators(
          requiredText,
          validBigNumber,
          greaterThan(1000),
          lessThanOrEqual(16000)
        )
        .setDisplayName("Threshold Const")
        .setDescription(
          "Controls how quickly the required confidence score for boosting goes up as the number of currently boosted proposals rises. threshold = thresholdConst ** (numberOfBoostedProposals)."
        )
        .setStory(
          "The boosting confidence score is this parameter raised to a power equal to the number of boosted proposals. Because the threshold goes up exponentially, this parameter sets a “soft cap” on the number of boosted proposals while still allowing the number of boosted proposals to scale with the size of the DAO."
        ),

      votersReputationLossRatio: new FriendlyField(
        form ? form.$.votersReputationLossRatio.value : "1"
      )
        .validators(requiredText, validBigNumber, validPercentage)
        .setDisplayName("Voters Reputation Loss Ratio")
        .setDescription(
          "The percentage of a voter’s voting power they stand to lose if they vote against the DAO’s eventual decision on a non-boosted proposal."
        )
        .setStory(
          "This loss / gain only applies to voting on non-boosted proposals. Voters who vote with the DAO’s eventual majority are rewarded with the voting power lost by incorrect voters. This has the effect of encouraging early votes to reflect the DAO’s perceived collective opinion, making the DAO more predictable and reliable overall. The larger this parameter is, the stronger the effect is."
        ),

      proposingRepReward: new FriendlyField(
        form ? form.$.proposingRepReward.value : "5"
      )
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("Proposing Rep Reward")
        .setDescription(
          "The amount of voting power given out as a reward for submitting a proposal that the DAO passes."
        )
        .setStory(
          "Each DAO has its own model of the ideal group of members to achieve its goals. Many of these models may include the idea that anyone who submits good ideas to the DAO belongs in that member group, and this parameter controls how much voting power those submitters are granted."
        ),

      activationTime: new FriendlyField(
        form ? form.$.activationTime.value : "0"
      )
        .validators(requiredText, validBigNumber, greaterThanOrEqual(0))
        .setDisplayName("Locking / Activation Time")
        .setDescription(
          "The point (represented in Unix time) in time when proposing and voting are activated."
        )
        .setStory(
          "Some DAOs may want to build in some set up time before governance begins: a staking period, a fund raising period, etc. This parameter sets that time."
        ),

      voteOnBehalf: new FriendlyField(
        form
          ? form.$.voteOnBehalf.value
          : "0x0000000000000000000000000000000000000000"
      )
        .validators(requiredText, validAddress)
        .setDisplayName("Vote On Behalf")
        .setDescription(
          "If set, only this address can call the vote function in the voting machine. This address would serve as a proxy voting module, and could contain additional functionality such as delegate based voting."
        )
    },
    // TODO: use utility function for conversions of gwei to eth
    function(this: GenesisProtocolForm): GenesisProtocol {
      return new GenesisProtocol({
        queuedVoteRequiredPercentage: toBN(
          this.$.queuedVoteRequiredPercentage.value
        ),
        queuedVotePeriodLimit: toBN(this.$.queuedVotePeriodLimit.value),
        thresholdConst: toBN(this.$.thresholdConst.value),
        proposingRepReward: toBN(toWei(toBN(this.$.proposingRepReward.value))),
        minimumDaoBounty: toBN(toWei(toBN(this.$.minimumDaoBounty.value))),
        boostedVotePeriodLimit: toBN(this.$.boostedVotePeriodLimit.value),
        daoBountyConst: toBN(this.$.daoBountyConst.value),
        activationTime: toBN(this.$.activationTime.value),
        preBoostedVotePeriodLimit: toBN(this.$.preBoostedVotePeriodLimit.value),
        quietEndingPeriod: toBN(this.$.quietEndingPeriod.value),
        voteOnBehalf: this.$.voteOnBehalf.value,
        votersReputationLossRatio: toBN(this.$.votersReputationLossRatio.value)
      });
    },
    function(this: GenesisProtocolForm, state: GenesisProtocol): void {
      const config = state.config;
      this.$.queuedVoteRequiredPercentage.value = config.queuedVoteRequiredPercentage.toString();
      this.$.queuedVotePeriodLimit.value = config.queuedVotePeriodLimit.toString();
      this.$.thresholdConst.value = config.thresholdConst.toString();
      this.$.proposingRepReward.value = fromWei(config.proposingRepReward);
      this.$.minimumDaoBounty.value = fromWei(config.minimumDaoBounty);
      this.$.boostedVotePeriodLimit.value = config.boostedVotePeriodLimit.toString();
      this.$.daoBountyConst.value = config.daoBountyConst.toString();
      this.$.activationTime.value = config.activationTime.toString();
      this.$.preBoostedVotePeriodLimit.value = config.preBoostedVotePeriodLimit.toString();
      this.$.quietEndingPeriod.value = config.quietEndingPeriod.toString();
      this.$.voteOnBehalf.value = config.voteOnBehalf;
      this.$.votersReputationLossRatio.value = config.votersReputationLossRatio.toString();
    }
  ).setDisplayName("Genesis Protocol");

// TODO: clean this up
// TODO: get the typename from the "SchemeType"
export class BaseSchemeForm<
  SchemeType extends Scheme,
  T extends ValidatableMapOrArray & { votingMachine: GenesisProtocolForm }
> extends FriendlyForm<SchemeType, T> {
  public getParams?: () => StringField[];

  constructor(
    $: T,
    toState: () => SchemeType,
    fromState: (state: SchemeType) => void,
    getParams: () => StringField[]
  ) {
    super($, toState, fromState);
    this.getParams = getParams.bind(this);
  }
}

export type SchemeForm =
  | GenericSchemeForm
  | ContributionRewardForm
  | SchemeRegistrarForm;

// TODO: support custom permissions
// TODO: support custom addresses / versions?
export type GenericSchemeForm = BaseSchemeForm<
  GenericScheme,
  {
    votingMachine: GenesisProtocolForm;
    contractToCall: StringField;
  }
>;

export const CreateGenericSchemeForm = (
  form?: GenericSchemeForm
): GenericSchemeForm =>
  new BaseSchemeForm(
    {
      votingMachine: form ? form.$.votingMachine : CreateGenesisProtocolForm(),

      contractToCall: new FriendlyField(
        form
          ? form.$.contractToCall.value
          : "0x0000000000000000000000000000000000000000"
      )
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Contract Address")
        .setDescription("Address of the contract to call")
    },
    function(this: GenericSchemeForm): GenericScheme {
      return new GenericScheme(
        this.$.contractToCall.value,
        this.$.votingMachine.toState()
      );
    },
    function(this: GenericSchemeForm, state: GenericScheme): void {
      this.$.contractToCall.value = state.contractToCall;
      // TODO: support multiple voting machine types
      this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
    },
    function(this: GenericSchemeForm): StringField[] {
      return [this.$.contractToCall];
    }
  )
    .setDisplayName("Generic Scheme")
    .setDescription(
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar."
    );

export type ContributionRewardForm = BaseSchemeForm<
  ContributionReward,
  {
    votingMachine: GenesisProtocolForm;
  }
>;

export const CreateContributionRewardForm = (
  form?: ContributionRewardForm
): ContributionRewardForm =>
  new BaseSchemeForm(
    {
      votingMachine: form ? form.$.votingMachine : CreateGenesisProtocolForm()
    },
    function(this: ContributionRewardForm): ContributionReward {
      return new ContributionReward(this.$.votingMachine.toState());
    },
    function(this: ContributionRewardForm, state: ContributionReward): void {
      // TODO: support multiple types of voting machines
      this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
    },
    function(this: ContributionRewardForm): StringField[] {
      return [];
    }
  )
    .setDisplayName("Contribution Reward")
    .setDescription(
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination."
    );

export type SchemeRegistrarForm = BaseSchemeForm<
  SchemeRegistrar,
  {
    votingMachine: GenesisProtocolForm;
  }
>;

export const CreateSchemeRegistrarForm = (
  form?: SchemeRegistrarForm
): SchemeRegistrarForm =>
  new BaseSchemeForm(
    {
      votingMachine: form ? form.$.votingMachine : CreateGenesisProtocolForm()
    },
    function(this: SchemeRegistrarForm): SchemeRegistrar {
      return new SchemeRegistrar(this.$.votingMachine.toState());
    },
    function(this: SchemeRegistrarForm, state: SchemeRegistrar): void {
      // TODO: support multiple voting machine types
      this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
    },
    function(this: SchemeRegistrarForm): StringField[] {
      return [];
    }
  )
    .setDisplayName("Scheme Registrar")
    .setDescription(
      "Manages post-creation adding/modifying and removing of schemes. Schemes add functionality to the DAO."
    );

export type SchemesForm = FriendlyForm<Scheme[], SchemeForm[]>;

export const CreateSchemesForm = (form?: SchemesForm): SchemesForm =>
  new FriendlyForm(
    [] as SchemeForm[],
    function(this: SchemesForm): Scheme[] {
      return this.$.map(
        (schemeForm: SchemeForm): Scheme => schemeForm.toState()
      );
    },
    function(this: SchemesForm, state: Scheme[]): void {
      this.$ = state.map(scheme => {
        let schemeForm: SchemeForm;

        switch (scheme.type) {
          case SchemeType.ContributionReward:
            schemeForm = CreateContributionRewardForm();
            schemeForm.fromState(scheme as ContributionReward);
            break;
          case SchemeType.SchemeRegistrar:
            schemeForm = CreateSchemeRegistrarForm();
            schemeForm.fromState(scheme as SchemeRegistrar);
            break;
          case SchemeType.GenericScheme:
            schemeForm = CreateGenericSchemeForm();
            schemeForm.fromState(scheme as GenericScheme);
            break;
          default:
            throw Error(`Unimplemented SchemeType ${SchemeType[scheme.type]}`);
        }

        return schemeForm;
      });
    }
  ).validators(requireElement("Scheme"));
