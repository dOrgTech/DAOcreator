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
var StringField = /** @class */ (function(_super) {
  __extends(StringField, _super);
  function StringField(init) {
    return _super.call(this, init, forms_1.FieldType.String) || this;
  }
  return StringField;
})(forms_1.Field);
exports.StringField = StringField;
//# sourceMappingURL=StringField.js.map
