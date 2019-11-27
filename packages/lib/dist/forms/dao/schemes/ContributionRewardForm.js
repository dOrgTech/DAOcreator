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
var SchemeForm_1 = require("../../../forms/dao/SchemeForm");
var forms_1 = require("../../../forms");
var state_1 = require("../../../state");
var ContributionRewardForm = /** @class */ (function(_super) {
  __extends(ContributionRewardForm, _super);
  function ContributionRewardForm(form) {
    var _this =
      _super.call(this, state_1.SchemeType.ContributionReward, {
        votingMachine: form
          ? form.$.votingMachine
          : new forms_1.GenesisProtocolForm({
              preset: state_1.GenesisProtocolPreset.Normal
            })
      }) || this;
    _this.setDisplayName("Contribution Reward");
    _this.setDescription(
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination."
    );
    return _this;
  }
  ContributionRewardForm.prototype.toState = function() {
    return new state_1.ContributionReward(this.$.votingMachine.toState());
  };
  ContributionRewardForm.prototype.fromState = function(state) {
    this.$.votingMachine.fromState(state.votingMachine);
  };
  ContributionRewardForm.prototype.getParams = function() {
    return [];
  };
  return ContributionRewardForm;
})(SchemeForm_1.SchemeForm);
exports.ContributionRewardForm = ContributionRewardForm;
//# sourceMappingURL=ContributionRewardForm.js.map
