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
var DAOConfigForm = /** @class */ (function(_super) {
  __extends(DAOConfigForm, _super);
  function DAOConfigForm(form) {
    return (
      _super.call(this, {
        daoName: new forms_1.StringField(form ? form.$.daoName.value : "")
          .validators(forms_1.requiredText, forms_1.validName)
          .setDisplayName("DAO Name")
          .setDescription("The name of the DAO."),
        tokenName: new forms_1.StringField(form ? form.$.tokenName.value : "")
          .validators(forms_1.requiredText, forms_1.validName)
          .setDisplayName("Token Name")
          .setDescription("The name of the DAO's token."),
        tokenSymbol: new forms_1.StringField(
          form ? form.$.tokenSymbol.value : ""
        )
          .validators(forms_1.requiredText, forms_1.validTokenSymbol)
          .setDisplayName("Token Symbol")
          .setDescription("The token's 4 letter symbol for exchanges.")
      }) || this
    );
  }
  DAOConfigForm.prototype.toState = function() {
    return {
      daoName: this.$.daoName.value,
      tokenName: this.$.tokenName.value,
      tokenSymbol: this.$.tokenSymbol.value
    };
  };
  DAOConfigForm.prototype.fromState = function(state) {
    this.$.daoName.value = state.daoName;
    this.$.tokenName.value = state.tokenName;
    this.$.tokenSymbol.value = state.tokenSymbol;
  };
  return DAOConfigForm;
})(Form_1.Form);
exports.DAOConfigForm = DAOConfigForm;
//# sourceMappingURL=DAOConfigForm.js.map
