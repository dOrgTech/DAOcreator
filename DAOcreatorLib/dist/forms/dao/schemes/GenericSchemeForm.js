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
// TODO: support custom permissions
// TODO: support custom addresses / versions?
var GenericSchemeForm = /** @class */ (function(_super) {
  __extends(GenericSchemeForm, _super);
  function GenericSchemeForm(form) {
    var _this =
      _super.call(this, state_1.SchemeType.GenericScheme, {
        votingMachine: form
          ? form.$.votingMachine
          : new forms_1.GenesisProtocolForm({
              preset: state_1.GenesisProtocolPreset.Normal
            }),
        contractToCall: new forms_1.AddressField(
          form
            ? form.$.contractToCall.value
            : "0x0000000000000000000000000000000000000000"
        )
          .validators(
            forms_1.requiredText,
            forms_1.validAddress,
            forms_1.nonZeroAddress
          )
          .setDisplayName("Contract Address")
          .setDescription("Address of the contract to call")
      }) || this;
    _this.setDisplayName("Generic Scheme");
    _this.setDescription(
      "A scheme for proposing and executing calls to an arbitrary function on a specific contract on behalf of the organization avatar."
    );
    return _this;
  }
  GenericSchemeForm.prototype.toState = function() {
    return new state_1.GenericScheme(
      this.$.contractToCall.value,
      this.$.votingMachine.toState()
    );
  };
  GenericSchemeForm.prototype.fromState = function(state) {
    this.$.contractToCall.value = state.contractToCall;
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine);
  };
  GenericSchemeForm.prototype.getParams = function() {
    return [this.$.contractToCall];
  };
  return GenericSchemeForm;
})(SchemeForm_1.SchemeForm);
exports.GenericSchemeForm = GenericSchemeForm;
//# sourceMappingURL=GenericSchemeForm.js.map
