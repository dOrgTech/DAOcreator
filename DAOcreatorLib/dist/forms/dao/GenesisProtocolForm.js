"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
var Form_1 = require("../../forms/Form");
var forms_1 = require("../../forms");
var state_1 = require("../../state");
var arc_1 = require("../../dependency/arc");
var GenesisProtocolForm = /** @class */ (function(_super) {
  __extends(GenesisProtocolForm, _super);
  function GenesisProtocolForm(opts) {
    var _this = this;
    var form = opts.form;
    var preset = opts.preset;
    _this =
      _super.call(this, {
        queuedVotePeriodLimit: new forms_1.DurationField(
          form ? form.$.queuedVotePeriodLimit.value : "00:00:00:00"
        )
          .setDisplayName("Queued Vote Period Limit")
          .setDescription(
            "The length of time that voting is open for non-boosted proposals."
          )
          .setStory(
            "All proposals start out in the regular queue, where they require an absolute majority of support to pass or to fail. This parameter controls how long the DAO has to vote on a non-boosted proposal, so the longer it is, the more votes a given proposal is likely to accrue during its voting period. A longer voting period, however, also means the DAO will process proposals more slowly."
          ),
        preBoostedVotePeriodLimit: new forms_1.DurationField(
          form ? form.$.preBoostedVotePeriodLimit.value : "00:00:00:00"
        )
          .setDisplayName("Pre-Boosted Vote Period Limit")
          .setDescription(
            "The length of time that a proposal must maintain a confidence score higher than the boosting threshold to become eligible for boosting."
          )
          .setStory(
            "If a proposal has received enough stake predicting its success to become boosted, it first has to go through this pending period, to ensure there’s a chance for predictors to downstake it. This improves the staking/boosting system’s prediction accuracy and resilience to malicious actions."
          ),
        boostedVotePeriodLimit: new forms_1.DurationField(
          form ? form.$.boostedVotePeriodLimit.value : "00:00:00:00"
        )
          .setDisplayName("Boosted Vote Period Limit")
          .setDescription(
            "The length of time that voting is open for boosted proposals."
          )
          .setStory(
            "Proposals can only become boosted by gaining high confidence scores (lots of predictions that they will succeed), and so boosted proposals are “fast-tracked”: they require no minimum quorum of voters and have a shorter voting time period than non-boosted proposals."
          ),
        quietEndingPeriod: new forms_1.DurationField(
          form ? form.$.quietEndingPeriod.value : "00:00:00:00"
        )
          .setDisplayName("Quiet Ending Period")
          .setDescription(
            "The length of time a vote’s potential result needs to stay the same in order to be confirmed as the official result."
          )
          .setStory(
            "Holding votes until the last second of a voting period is not good for collective intelligence, and the quiet ending period helps get rid of it. If a vote switches from yes to no, or vice versa, near the end of the voting time (during it’s quiet ending period), extra voting time (another quiet ending period) is added."
          ),
        queuedVoteRequiredPercentage: new forms_1.PercentageField(
          form ? form.$.queuedVoteRequiredPercentage.value : 0
        )
          .validators(forms_1.validPercentage)
          .setDisplayName("Queued Vote Required Percentage")
          .setDescription(
            "The quorum required to decide a vote on a non-boosted proposal."
          )
          .setStory(
            "We think of non-boosted proposals as requiring more than 50% of a DAO’s voting power to decide, but this percentage is actually adjustable as well. Some DAOs may want to require a supermajority such as 60% and others, realizing how unlikely reaching 50% consensus is given participation rates, may want a lower quorum."
          ),
        minimumDaoBounty: new forms_1.TokenField(
          "GEN",
          form ? form.$.minimumDaoBounty.value : "0"
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThanOrEqual(0)
          )
          .setDisplayName("Minimum DAO Bounty")
          .setDescription(
            "The minimum amount of GEN a DAO will stake when automatically downstaking each proposal."
          )
          .setStory(
            "The DAO will automatically downstake every proposal, in order to properly set up the staking system, and this parameter sets the minimum size for that downstake. A higher minimum means the DAO is more heavily subsidizing staking."
          ),
        daoBountyConst: new forms_1.StringField(
          form ? form.$.daoBountyConst.value : "1"
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThan(0)
          )
          .setDisplayName("DAO Bounty Const")
          .setDescription(
            "This is multiplied by the average downstake on boosted proposals to calculate how large the DAO’s automatic downstake should be."
          )
          .setStory(
            "A size coefficient of 1 will mean the DAO automatically downstakes new proposal with a downstake as large as the average downstake on boosted proposals (unless that would be smaller than the minimum DAOstake parameter!)."
          ),
        thresholdConst: new forms_1.StringField(
          form ? form.$.thresholdConst.value : "1200"
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThan(1000),
            forms_1.lessThanOrEqual(16000)
          )
          .setDisplayName("Threshold Const")
          .setDescription(
            "Controls how quickly the required confidence score for boosting goes up as the number of currently boosted proposals rises. threshold = thresholdConst ** (numberOfBoostedProposals)."
          )
          .setStory(
            "The boosting confidence score is this parameter raised to a power equal to the number of boosted proposals. Because the threshold goes up exponentially, this parameter sets a “soft cap” on the number of boosted proposals while still allowing the number of boosted proposals to scale with the size of the DAO."
          ),
        votersReputationLossRatio: new forms_1.PercentageField(
          form ? form.$.votersReputationLossRatio.value : 0
        )
          .validators(forms_1.validPercentage)
          .setDisplayName("Voters Reputation Loss Ratio")
          .setDescription(
            "The percentage of a voter’s voting power they stand to lose if they vote against the DAO’s eventual decision on a non-boosted proposal."
          )
          .setStory(
            "This loss / gain only applies to voting on non-boosted proposals. Voters who vote with the DAO’s eventual majority are rewarded with the voting power lost by incorrect voters. This has the effect of encouraging early votes to reflect the DAO’s perceived collective opinion, making the DAO more predictable and reliable overall. The larger this parameter is, the stronger the effect is."
          ),
        proposingRepReward: new forms_1.TokenField(
          "REP",
          form ? form.$.proposingRepReward.value : "0"
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThan(0)
          )
          .setDisplayName("Proposing Rep Reward")
          .setDescription(
            "The amount of voting power given out as a reward for submitting a proposal that the DAO passes."
          )
          .setStory(
            "Each DAO has its own model of the ideal group of members to achieve its goals. Many of these models may include the idea that anyone who submits good ideas to the DAO belongs in that member group, and this parameter controls how much voting power those submitters are granted."
          ),
        activationTime: new forms_1.DateTimeField(
          form ? form.$.activationTime.value : undefined
        )
          .validators(forms_1.futureDate)
          .setDisplayName("Locking / Activation Time")
          .setDescription(
            "The point (represented in Unix time) in time when proposing and voting are activated."
          )
          .setStory(
            "Some DAOs may want to build in some set up time before governance begins: a staking period, a fund raising period, etc. This parameter sets that time."
          ),
        voteOnBehalf: new forms_1.AddressField(
          form
            ? form.$.voteOnBehalf.value
            : "0x0000000000000000000000000000000000000000"
        )
          .validators(forms_1.requiredText, forms_1.validAddress)
          .setDisplayName("Vote On Behalf")
          .setDescription(
            "If set, only this address can call the vote function in the voting machine. This address would serve as a proxy voting module, and could contain additional functionality such as delegate based voting."
          )
      }) || this;
    _this.setDisplayName("Genesis Protocol");
    if (form && preset) {
      throw Error(
        "Cannot construct a GenesisProtocolForm with both a form and a preset. Please supply only one."
      );
    }
    if (preset) {
      _this.preset = preset;
    } else if (form) {
      _this._preset = form.preset;
    } else {
      _this.preset = arc_1.GenesisProtocolPreset.Normal;
    }
    return _this;
  }
  Object.defineProperty(GenesisProtocolForm.prototype, "preset", {
    get: function() {
      return this._preset;
    },
    set: function(value) {
      this._preset = value;
      if (value) {
        this.fromState(
          new state_1.GenesisProtocol({
            preset: value
          })
        );
      }
    },
    enumerable: true,
    configurable: true
  });
  GenesisProtocolForm.prototype.toState = function() {
    if (this.preset) {
      return new state_1.GenesisProtocol({ preset: this.preset });
    } else {
      return new state_1.GenesisProtocol({
        config: {
          queuedVoteRequiredPercentage: Number(
            this.$.queuedVoteRequiredPercentage.value
          ),
          queuedVotePeriodLimit: this.$.queuedVotePeriodLimit.toSeconds(),
          thresholdConst: Number(this.$.thresholdConst.value),
          proposingRepReward: Number(this.$.proposingRepReward.value),
          minimumDaoBounty: Number(this.$.minimumDaoBounty.value),
          boostedVotePeriodLimit: this.$.boostedVotePeriodLimit.toSeconds(),
          daoBountyConst: Number(this.$.daoBountyConst.value),
          // TODO: future only is a hack for the editor, it won't work
          // if we're viewing past data froma already deployed DAO...
          activationTime: this.$.activationTime.getunixTime(),
          preBoostedVotePeriodLimit: this.$.preBoostedVotePeriodLimit.toSeconds(),
          quietEndingPeriod: this.$.quietEndingPeriod.toSeconds(),
          voteOnBehalf: this.$.voteOnBehalf.value,
          votersReputationLossRatio: this.$.votersReputationLossRatio.value
        }
      });
    }
  };
  GenesisProtocolForm.prototype.fromState = function(state) {
    this._preset = state.preset;
    var config = state.config;
    this.$.queuedVoteRequiredPercentage.value =
      config.queuedVoteRequiredPercentage;
    this.$.queuedVotePeriodLimit.fromSeconds(config.queuedVotePeriodLimit);
    this.$.thresholdConst.value = config.thresholdConst.toString();
    this.$.proposingRepReward.value = config.proposingRepReward.toString();
    this.$.minimumDaoBounty.value = config.minimumDaoBounty.toString();
    this.$.boostedVotePeriodLimit.fromSeconds(config.boostedVotePeriodLimit);
    this.$.daoBountyConst.value = config.daoBountyConst.toString();
    this.$.activationTime.fromUnixTime(config.activationTime);
    this.$.preBoostedVotePeriodLimit.fromSeconds(
      config.preBoostedVotePeriodLimit
    );
    this.$.quietEndingPeriod.fromSeconds(config.quietEndingPeriod);
    this.$.voteOnBehalf.value = config.voteOnBehalf;
    this.$.votersReputationLossRatio.value = config.votersReputationLossRatio;
  };
  return GenesisProtocolForm;
})(Form_1.Form);
exports.GenesisProtocolForm = GenesisProtocolForm;
//# sourceMappingURL=GenesisProtocolForm.js.map
