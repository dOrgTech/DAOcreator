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
// TODO: add standard verifiers for known types
var AddressField = /** @class */ (function(_super) {
  __extends(AddressField, _super);
  function AddressField(init) {
    return _super.call(this, init, forms_1.FieldType.Address) || this;
  }
  return AddressField;
})(forms_1.Field);
exports.AddressField = AddressField;
//# sourceMappingURL=AddressField.js.map
