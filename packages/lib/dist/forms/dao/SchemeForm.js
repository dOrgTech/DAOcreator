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
var SchemeForm = /** @class */ (function(_super) {
  __extends(SchemeForm, _super);
  function SchemeForm(type, $) {
    var _this = _super.call(this, $) || this;
    _this._type = type;
    return _this;
  }
  Object.defineProperty(SchemeForm.prototype, "type", {
    get: function() {
      return this._type;
    },
    enumerable: true,
    configurable: true
  });
  return SchemeForm;
})(Form_1.Form);
exports.SchemeForm = SchemeForm;
var SchemesForm = /** @class */ (function(_super) {
  __extends(SchemesForm, _super);
  function SchemesForm(form) {
    var _this = _super.call(this, form ? form.$ : []) || this;
    _this.validators(forms_1.requireElement("Scheme"));
    return _this;
  }
  SchemesForm.prototype.toState = function() {
    return this.$.map(function(schemeForm) {
      return schemeForm.toState();
    });
  };
  SchemesForm.prototype.fromState = function(state) {
    this.$ = state.map(function(scheme) {
      var schemeForm;
      switch (scheme.type) {
        case state_1.SchemeType.ContributionReward:
          schemeForm = new forms_1.ContributionRewardForm();
          schemeForm.fromState(scheme);
          break;
        case state_1.SchemeType.SchemeRegistrar:
          schemeForm = new forms_1.SchemeRegistrarForm();
          schemeForm.fromState(scheme);
          break;
        case state_1.SchemeType.GenericScheme:
          schemeForm = new forms_1.GenericSchemeForm();
          schemeForm.fromState(scheme);
          break;
        default:
          throw Error(
            "Unimplemented SchemeType " + state_1.SchemeType[scheme.type]
          );
      }
      return schemeForm;
    });
  };
  return SchemesForm;
})(Form_1.Form);
exports.SchemesForm = SchemesForm;
//# sourceMappingURL=SchemeForm.js.map
