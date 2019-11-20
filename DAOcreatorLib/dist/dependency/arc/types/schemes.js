"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchemeType;
(function(SchemeType) {
  SchemeType[(SchemeType["ContributionReward"] = 0)] = "ContributionReward";
  SchemeType[(SchemeType["SchemeRegistrar"] = 1)] = "SchemeRegistrar";
  SchemeType[(SchemeType["GenericScheme"] = 2)] = "GenericScheme";
})((SchemeType = exports.SchemeType || (exports.SchemeType = {})));
var ContributionReward = /** @class */ (function() {
  function ContributionReward(votingMachine) {
    this.type = SchemeType.ContributionReward;
    this.permissions = "0x00000000";
    this.votingMachine = votingMachine;
  }
  return ContributionReward;
})();
exports.ContributionReward = ContributionReward;
// TODO: support multiple voting machine configurations
var SchemeRegistrar = /** @class */ (function() {
  function SchemeRegistrar(votingMachine) {
    this.type = SchemeType.SchemeRegistrar;
    this.permissions = "0x0000001F";
    this.votingMachine = votingMachine;
  }
  return SchemeRegistrar;
})();
exports.SchemeRegistrar = SchemeRegistrar;
var GenericScheme = /** @class */ (function() {
  function GenericScheme(contractToCall, votingMachine) {
    this.contractToCall = contractToCall;
    this.type = SchemeType.GenericScheme;
    this.permissions = "0x00000010";
    this.votingMachine = votingMachine;
  }
  return GenericScheme;
})();
exports.GenericScheme = GenericScheme;
//# sourceMappingURL=schemes.js.map
