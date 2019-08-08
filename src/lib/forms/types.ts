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
  nonZeroAddress,
  positiveDuration,
  validDuration,
  futureDate
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

export enum FieldType {
  String,
  Token,
  DateTime,
  Duration,
  Address,
  Percentage
}

export abstract class FriendlyField<
  ValueType,
  DerivedType extends FriendlyField<ValueType, DerivedType>
> extends FieldState<ValueType> {
  private _description: string = "";
  private _displayName: string = "";
  private _story: string = "";
  private _type: FieldType;

  constructor(init: ValueType, type: FieldType) {
    super(init);
    this._type = type;
  }

  setDescription(description: string): DerivedType {
    this._description = description;
    return (this as any) as DerivedType;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): DerivedType {
    this._displayName = displayName;
    return (this as any) as DerivedType;
  }

  get displayName(): string {
    return this._displayName;
  }

  setStory(story: string): DerivedType {
    this._story = story;
    return (this as any) as DerivedType;
  }

  get story(): string {
    return this._story;
  }

  get type(): FieldType {
    return this._type;
  }
}

export class StringField extends FriendlyField<string, StringField> {
  constructor(init: string) {
    super(init, FieldType.String);
  }
}

export class TokenField extends FriendlyField<string, TokenField> {
  private _symbol: string | (() => string);

  constructor(symbol: string | (() => string), init: string) {
    super(init, FieldType.Token);
    this._symbol = symbol;
  }

  get symbol(): string {
    if (typeof this._symbol === "string") {
      return this._symbol as string;
    } else {
      return this._symbol();
    }
  }
}

export class DateTimeField extends FriendlyField<Date, DateTimeField> {
  constructor(init: Date) {
    super(init, FieldType.DateTime);
  }

  public getunixTime(futureOnly?: boolean): number {
    if (futureOnly) {
      if (Date.now() < this.value.getTime()) {
        return 0;
      }
    }

    // div by 1000 to convert to seconds
    return this.value.getTime() / 1000;
  }

  public fromUnixTime(unix: number) {
    if (unix === 0) {
      // now
      this.value = new Date();
    } else {
      // mul by 1000 to convert to milliseconds
      this.value = new Date(unix * 1000);
    }
  }
}

// Format: DD:hh:mm:ss
export class DurationField extends FriendlyField<string, DurationField> {
  get days(): number {
    const parts = this.value.split(":");
    return Number(parts[0]);
  }

  get hours(): number {
    const parts = this.value.split(":");
    return Number(parts[1]);
  }

  get minutes(): number {
    const parts = this.value.split(":");
    return Number(parts[2]);
  }

  get seconds(): number {
    const parts = this.value.split(":");
    return Number(parts[3]);
  }

  constructor(init: string) {
    super(init, FieldType.Duration);
    this.validators(validDuration, positiveDuration);
  }

  // TODO: put these constants somewhere (86400, 3600, etc)
  public toSeconds(): number {
    const parts = this.value.split(":");
    const days = Number(parts[0]);
    const hours = Number(parts[1]);
    const minutes = Number(parts[2]);
    const seconds = Number(parts[3]);

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  public fromSeconds(seconds: number) {
    const days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.trunc(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.trunc(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.trunc(seconds);
    return `${days}:${hours}:${minutes}:${seconds}`;
  }
}

// TODO: add standard verifiers for known types
export class AddressField extends FriendlyField<string, AddressField> {
  constructor(init: string) {
    super(init, FieldType.Address);
  }
}

export class PercentageField extends FriendlyField<string, PercentageField> {
  constructor(init: string) {
    super(init, FieldType.Percentage);
  }
}

export type AnyField =
  | StringField
  | TokenField
  | DateTimeField
  | DurationField
  | AddressField
  | PercentageField;

export abstract class FriendlyForm<
  StateType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  public abstract toState(): StateType;
  public abstract fromState(state: StateType): void;

  private _description: string = "";
  private _displayName: string = "";

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

export class DAOForm extends FriendlyForm<
  DAOcreatorState,
  {
    config: DAOConfigForm;
    members: MembersForm;
    schemes: SchemesForm;
  }
> {
  constructor(form?: DAOForm) {
    const daoConfig = new DAOConfigForm(form ? form.$.config : undefined);
    const getDAOTokenSymbol = () => daoConfig.$.tokenSymbol.value;

    super({
      config: daoConfig,
      members: new MembersForm(
        getDAOTokenSymbol,
        form ? form.$.members : undefined
      ),
      schemes: new SchemesForm(form ? form.$.schemes : undefined)
    });
  }

  public toState(): DAOcreatorState {
    return {
      config: this.$.config.toState(),
      members: this.$.members.toState(),
      schemes: this.$.schemes.toState()
    };
  }

  public fromState(state: DAOcreatorState) {
    this.$.config.fromState(state.config);
    this.$.members.fromState(state.members);
    this.$.schemes.fromState(state.schemes);
  }
}

export class DAOConfigForm extends FriendlyForm<
  DAOConfig,
  {
    daoName: StringField;
    tokenName: StringField;
    tokenSymbol: StringField;
  }
> {
  constructor(form?: DAOConfigForm) {
    super({
      daoName: new StringField(form ? form.$.daoName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("DAO Name")
        .setDescription("The name of the DAO."),

      tokenName: new StringField(form ? form.$.tokenName.value : "")
        .validators(requiredText, validName)
        .setDisplayName("Token Name")
        .setDescription("The name of the DAO's token."),

      tokenSymbol: new StringField(form ? form.$.tokenSymbol.value : "")
        .validators(requiredText, validTokenSymbol)
        .setDisplayName("Token Symbol")
        .setDescription("The token's 4 letter symbol for exchanges.")
    });
  }

  public toState(): DAOConfig {
    return {
      daoName: this.$.daoName.value,
      tokenName: this.$.tokenName.value,
      tokenSymbol: this.$.tokenSymbol.value
    };
  }

  public fromState(state: DAOConfig) {
    this.$.daoName.value = state.daoName;
    this.$.tokenName.value = state.tokenName;
    this.$.tokenSymbol.value = state.tokenSymbol;
  }
}

export class MembersForm extends FriendlyForm<Member[], MemberForm[]> {
  private _getDAOTokenSymbol: () => string;

  constructor(getDAOTokenSymbol: () => string, form?: MembersForm) {
    super(form ? form.$ : ([] as MemberForm[]));
    this._getDAOTokenSymbol = getDAOTokenSymbol;
    this.validators(
      requireElement("Member"),
      noDuplicates(
        (a: MemberForm, b: MemberForm) =>
          a.$.address.value === b.$.address.value
      )
    );
  }

  public toState(): Member[] {
    return this.$.map((member: MemberForm): Member => member.toState());
  }

  public fromState(state: Member[]) {
    this.$ = state.map(member => {
      const memberForm = new MemberForm(this._getDAOTokenSymbol);
      memberForm.fromState(member);
      return memberForm;
    });
  }
}

export class MemberForm extends FriendlyForm<
  Member,
  {
    address: AddressField;
    reputation: TokenField;
    tokens: TokenField;
  }
> {
  private _getDAOTokenSymbol: () => string;

  get getDAOTokenSymbol() {
    return this._getDAOTokenSymbol;
  }

  constructor(getDAOTokenSymbol: () => string, form?: MemberForm) {
    super({
      address: new AddressField(form ? form.$.address.value : "")
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Address")
        .setDescription("The member's public address."),

      reputation: new TokenField("REP", form ? form.$.reputation.value : "")
        .validators(requiredText, validBigNumber)
        .setDisplayName("Reputation")
        .setDescription(
          "The member's reputation (voting power) within the DAO."
        ),

      tokens: new TokenField(getDAOTokenSymbol, form ? form.$.tokens.value : "")
        .validators(requiredText, validBigNumber)
        .setDisplayName("Tokens")
        .setDescription("The number of DAO tokens this member owns.")
    });
    this._getDAOTokenSymbol = getDAOTokenSymbol;
  }

  public toState(): Member {
    return {
      address: this.$.address.value,
      tokens: toBN(this.$.tokens.value),
      reputation: toBN(this.$.reputation.value)
    };
  }

  public fromState(state: Member) {
    this.$.address.value = state.address;
    this.$.reputation.value = state.reputation.toString();
    this.$.tokens.value = state.tokens.toString();
  }
}

export class GenesisProtocolForm extends FriendlyForm<
  GenesisProtocol,
  {
    queuedVotePeriodLimit: DurationField;
    preBoostedVotePeriodLimit: DurationField;
    boostedVotePeriodLimit: DurationField;
    quietEndingPeriod: DurationField;
    queuedVoteRequiredPercentage: PercentageField;
    minimumDaoBounty: TokenField;
    daoBountyConst: StringField;
    thresholdConst: StringField;
    votersReputationLossRatio: PercentageField;
    proposingRepReward: TokenField;
    activationTime: DateTimeField;
    voteOnBehalf: AddressField;
  }
> {
  constructor(form?: GenesisProtocolForm) {
    super({
      queuedVotePeriodLimit: new DurationField(
        form ? form.$.queuedVotePeriodLimit.value : "00:00:30:00"
      )
        .setDisplayName("Queued Vote Period Limit")
        .setDescription(
          "The length of time that voting is open for non-boosted proposals."
        )
        .setStory(
          "All proposals start out in the regular queue, where they require an absolute majority of support to pass or to fail. This parameter controls how long the DAO has to vote on a non-boosted proposal, so the longer it is, the more votes a given proposal is likely to accrue during its voting period. A longer voting period, however, also means the DAO will process proposals more slowly."
        ),

      preBoostedVotePeriodLimit: new DurationField(
        form ? form.$.preBoostedVotePeriodLimit.value : "21:00:00:00"
      )
        .setDisplayName("Pre-Boosted Vote Period Limit")
        .setDescription(
          "The length of time that a proposal must maintain a confidence score higher than the boosting threshold to become eligible for boosting."
        )
        .setStory(
          "If a proposal has received enough stake predicting its success to become boosted, it first has to go through this pending period, to ensure there’s a chance for predictors to downstake it. This improves the staking/boosting system’s prediction accuracy and resilience to malicious actions."
        ),

      boostedVotePeriodLimit: new DurationField(
        form ? form.$.boostedVotePeriodLimit.value : "03:00:00:00"
      )
        .setDisplayName("Boosted Vote Period Limit")
        .setDescription(
          "The length of time that voting is open for boosted proposals."
        )
        .setStory(
          "Proposals can only become boosted by gaining high confidence scores (lots of predictions that they will succeed), and so boosted proposals are “fast-tracked”: they require no minimum quorum of voters and have a shorter voting time period than non-boosted proposals."
        ),

      quietEndingPeriod: new DurationField(
        form ? form.$.quietEndingPeriod.value : "01:00:00:00"
      )
        .setDisplayName("Quiet Ending Period")
        .setDescription(
          "The length of time a vote’s potential result needs to stay the same in order to be confirmed as the official result."
        )
        .setStory(
          "Holding votes until the last second of a voting period is not good for collective intelligence, and the quiet ending period helps get rid of it. If a vote switches from yes to no, or vice versa, near the end of the voting time (during it’s quiet ending period), extra voting time (another quiet ending period) is added."
        ),

      queuedVoteRequiredPercentage: new PercentageField(
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

      minimumDaoBounty: new TokenField(
        "GEN",
        form ? form.$.minimumDaoBounty.value : "100"
      )
        .validators(requiredText, validBigNumber, greaterThanOrEqual(0))
        .setDisplayName("Minimum DAO Bounty")
        .setDescription(
          "The minimum amount of GEN a DAO will stake when automatically downstaking each proposal."
        )
        .setStory(
          "The DAO will automatically downstake every proposal, in order to properly set up the staking system, and this parameter sets the minimum size for that downstake. A higher minimum means the DAO is more heavily subsidizing staking."
        ),

      daoBountyConst: new StringField(form ? form.$.daoBountyConst.value : "75")
        .validators(requiredText, validBigNumber, greaterThan(0))
        .setDisplayName("DAO Bounty Const")
        .setDescription(
          "This is multiplied by the average downstake on boosted proposals to calculate how large the DAO’s automatic downstake should be."
        )
        .setStory(
          "A size coefficient of 1 will mean the DAO automatically downstakes new proposal with a downstake as large as the average downstake on boosted proposals (unless that would be smaller than the minimum DAOstake parameter!)."
        ),

      thresholdConst: new StringField(
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

      votersReputationLossRatio: new PercentageField(
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

      proposingRepReward: new TokenField(
        "REP",
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

      activationTime: new DateTimeField(
        form ? form.$.activationTime.value : new Date()
      )
        .validators(futureDate)
        .setDisplayName("Locking / Activation Time")
        .setDescription(
          "The point (represented in Unix time) in time when proposing and voting are activated."
        )
        .setStory(
          "Some DAOs may want to build in some set up time before governance begins: a staking period, a fund raising period, etc. This parameter sets that time."
        ),

      voteOnBehalf: new AddressField(
        form
          ? form.$.voteOnBehalf.value
          : "0x0000000000000000000000000000000000000000"
      )
        .validators(requiredText, validAddress)
        .setDisplayName("Vote On Behalf")
        .setDescription(
          "If set, only this address can call the vote function in the voting machine. This address would serve as a proxy voting module, and could contain additional functionality such as delegate based voting."
        )
    });

    this.setDisplayName("Genesis Protocol");
  }

  // TODO: have fields that convert themselves (gwei to eth)
  public toState(): GenesisProtocol {
    return new GenesisProtocol({
      queuedVoteRequiredPercentage: toBN(
        this.$.queuedVoteRequiredPercentage.value
      ),
      queuedVotePeriodLimit: toBN(this.$.queuedVotePeriodLimit.toSeconds()),
      thresholdConst: toBN(this.$.thresholdConst.value),
      proposingRepReward: toBN(toWei(toBN(this.$.proposingRepReward.value))),
      minimumDaoBounty: toBN(toWei(toBN(this.$.minimumDaoBounty.value))),
      boostedVotePeriodLimit: toBN(this.$.boostedVotePeriodLimit.toSeconds()),
      daoBountyConst: toBN(this.$.daoBountyConst.value),
      // TODO: future only is a hack for the editor, it won't work
      // if we're viewing past data froma already deployed DAO...
      activationTime: toBN(this.$.activationTime.getunixTime(true)),
      preBoostedVotePeriodLimit: toBN(
        this.$.preBoostedVotePeriodLimit.toSeconds()
      ),
      quietEndingPeriod: toBN(this.$.quietEndingPeriod.toSeconds()),
      voteOnBehalf: this.$.voteOnBehalf.value,
      votersReputationLossRatio: toBN(this.$.votersReputationLossRatio.value)
    });
  }

  public fromState(state: GenesisProtocol) {
    const config = state.config;
    this.$.queuedVoteRequiredPercentage.value = config.queuedVoteRequiredPercentage.toString();
    this.$.queuedVotePeriodLimit.fromSeconds(
      config.queuedVotePeriodLimit.toNumber()
    );
    this.$.thresholdConst.value = config.thresholdConst.toString();
    this.$.proposingRepReward.value = fromWei(config.proposingRepReward);
    this.$.minimumDaoBounty.value = fromWei(config.minimumDaoBounty);
    this.$.boostedVotePeriodLimit.fromSeconds(
      config.boostedVotePeriodLimit.toNumber()
    );
    this.$.daoBountyConst.value = config.daoBountyConst.toString();
    this.$.activationTime.fromUnixTime(config.activationTime.toNumber());
    this.$.preBoostedVotePeriodLimit.fromSeconds(
      config.preBoostedVotePeriodLimit.toNumber()
    );
    this.$.quietEndingPeriod.fromSeconds(config.quietEndingPeriod.toNumber());
    this.$.voteOnBehalf.value = config.voteOnBehalf;
    this.$.votersReputationLossRatio.value = config.votersReputationLossRatio.toString();
  }
}

export abstract class SchemeForm<
  StateType extends Scheme,
  T extends ValidatableMapOrArray & { votingMachine: GenesisProtocolForm }
> extends FriendlyForm<StateType, T> {
  public abstract getParams(): AnyField[];

  private _type: SchemeType;

  get type() {
    return this._type;
  }

  constructor(type: SchemeType, $: T) {
    super($);
    this._type = type;
  }
}

export type AnySchemeForm =
  | GenericSchemeForm
  | ContributionRewardForm
  | SchemeRegistrarForm;

// TODO: support custom permissions
// TODO: support custom addresses / versions?
export class GenericSchemeForm extends SchemeForm<
  GenericScheme,
  {
    votingMachine: GenesisProtocolForm;
    contractToCall: AddressField;
  }
> {
  constructor(form?: GenericSchemeForm) {
    super(SchemeType.GenericScheme, {
      votingMachine: form ? form.$.votingMachine : new GenesisProtocolForm(),

      contractToCall: new AddressField(
        form
          ? form.$.contractToCall.value
          : "0x0000000000000000000000000000000000000000"
      )
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Contract Address")
        .setDescription("Address of the contract to call")
    });

    this.setDisplayName("Generic Scheme");
    this.setDescription(
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar."
    );
  }

  public toState(): GenericScheme {
    return new GenericScheme(
      this.$.contractToCall.value,
      this.$.votingMachine.toState()
    );
  }

  public fromState(state: GenericScheme) {
    this.$.contractToCall.value = state.contractToCall;
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [this.$.contractToCall];
  }
}

export class ContributionRewardForm extends SchemeForm<
  ContributionReward,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: ContributionRewardForm) {
    super(SchemeType.ContributionReward, {
      votingMachine: form ? form.$.votingMachine : new GenesisProtocolForm()
    });

    this.setDisplayName("Contribution Reward");
    this.setDescription(
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination."
    );
  }

  public toState(): ContributionReward {
    return new ContributionReward(this.$.votingMachine.toState());
  }

  public fromState(state: ContributionReward) {
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [];
  }
}

export class SchemeRegistrarForm extends SchemeForm<
  SchemeRegistrar,
  {
    votingMachine: GenesisProtocolForm;
  }
> {
  constructor(form?: SchemeRegistrarForm) {
    super(SchemeType.SchemeRegistrar, {
      votingMachine: form ? form.$.votingMachine : new GenesisProtocolForm()
    });

    this.setDisplayName("Scheme Registrar");
    this.setDescription(
      "Manages post-creation adding/modifying and removing of schemes. Schemes add functionality to the DAO."
    );
  }

  public toState(): SchemeRegistrar {
    return new SchemeRegistrar(this.$.votingMachine.toState());
  }

  public fromState(state: SchemeRegistrar) {
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine as GenesisProtocol);
  }

  public getParams(): AnyField[] {
    return [];
  }
}

export class SchemesForm extends FriendlyForm<Scheme[], AnySchemeForm[]> {
  constructor(form?: SchemesForm) {
    super(form ? form.$ : ([] as AnySchemeForm[]));

    this.validators(requireElement("Scheme"));
  }

  public toState(): Scheme[] {
    return this.$.map(
      (schemeForm: AnySchemeForm): Scheme => schemeForm.toState()
    );
  }

  public fromState(state: Scheme[]) {
    this.$ = state.map(scheme => {
      let schemeForm: AnySchemeForm;

      switch (scheme.type) {
        case SchemeType.ContributionReward:
          schemeForm = new ContributionRewardForm();
          schemeForm.fromState(scheme as ContributionReward);
          break;
        case SchemeType.SchemeRegistrar:
          schemeForm = new SchemeRegistrarForm();
          schemeForm.fromState(scheme as SchemeRegistrar);
          break;
        case SchemeType.GenericScheme:
          schemeForm = new GenericSchemeForm();
          schemeForm.fromState(scheme as GenericScheme);
          break;
        default:
          throw Error(`Unimplemented SchemeType ${SchemeType[scheme.type]}`);
      }

      return schemeForm;
    });
  }
}
