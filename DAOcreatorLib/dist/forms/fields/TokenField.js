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
var forms_1 = require("../../forms");
var TokenField = /** @class */ (function(_super) {
  __extends(TokenField, _super);
  function TokenField(symbol, init) {
    var _this = _super.call(this, init, forms_1.FieldType.Token) || this;
    _this._symbol = symbol;
    return _this;
  }
  Object.defineProperty(TokenField.prototype, "symbol", {
    get: function() {
      if (typeof this._symbol === "string") {
        return this._symbol;
      } else {
        return this._symbol();
      }
    },
    enumerable: true,
    configurable: true
  });
  return TokenField;
})(forms_1.Field);
exports.TokenField = TokenField;
//# sourceMappingURL=TokenField.js.map
