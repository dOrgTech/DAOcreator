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
var SchemeRegistrarForm = /** @class */ (function(_super) {
  __extends(SchemeRegistrarForm, _super);
  function SchemeRegistrarForm(form) {
    var _this =
      _super.call(this, state_1.SchemeType.SchemeRegistrar, {
        votingMachine: form
          ? form.$.votingMachine
          : new forms_1.GenesisProtocolForm({
              preset: state_1.GenesisProtocolPreset.Critical
            })
      }) || this;
    _this.setDisplayName("Scheme Registrar");
    _this.setDescription(
      "Manages post-creation adding/modifying and removing of schemes. Schemes add functionality to the DAO."
    );
    return _this;
  }
  SchemeRegistrarForm.prototype.toState = function() {
    return new state_1.SchemeRegistrar(this.$.votingMachine.toState());
  };
  SchemeRegistrarForm.prototype.fromState = function(state) {
    // TODO: support multiple voting machine types
    this.$.votingMachine.fromState(state.votingMachine);
  };
  SchemeRegistrarForm.prototype.getParams = function() {
    return [];
  };
  return SchemeRegistrarForm;
})(SchemeForm_1.SchemeForm);
exports.SchemeRegistrarForm = SchemeRegistrarForm;
//# sourceMappingURL=SchemeRegistrarForm.js.map
