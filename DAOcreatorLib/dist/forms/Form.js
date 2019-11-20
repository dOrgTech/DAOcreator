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
var formstate_1 = require("formstate");
var Form = /** @class */ (function(_super) {
  __extends(Form, _super);
  function Form() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this._description = "";
    _this._displayName = "";
    return _this;
  }
  Form.prototype.setDescription = function(description) {
    this._description = description;
    return this;
  };
  Object.defineProperty(Form.prototype, "description", {
    get: function() {
      return this._description;
    },
    enumerable: true,
    configurable: true
  });
  Form.prototype.setDisplayName = function(displayName) {
    this._displayName = displayName;
    return this;
  };
  Object.defineProperty(Form.prototype, "displayName", {
    get: function() {
      return this._displayName;
    },
    enumerable: true,
    configurable: true
  });
  Form.prototype.setValues = function(values) {
    // iterate through all the possible keys
    for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      var field = this.$[key];
      // if it's a FieldState, it has the property "value"
      if (field.hasOwnProperty("value")) {
        field.value = value;
      } else {
        this.$[key] = value;
      }
    }
    return this;
  };
  Object.defineProperty(Form.prototype, "values", {
    get: function() {
      var values = {};
      for (var _i = 0, _a = Object.entries(this.$); _i < _a.length; _i++) {
        var _b = _a[_i],
          key = _b[0],
          value = _b[1];
        if (value.hasOwnProperty("value")) {
          values[key] = value.value;
        } else {
          values[key] = value;
        }
      }
      return values;
    },
    enumerable: true,
    configurable: true
  });
  return Form;
})(formstate_1.FormState);
exports.Form = Form;
//# sourceMappingURL=Form.js.map
