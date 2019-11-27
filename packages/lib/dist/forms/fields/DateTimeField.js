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
var DateTimeField = /** @class */ (function(_super) {
  __extends(DateTimeField, _super);
  function DateTimeField(init) {
    return _super.call(this, init, forms_1.FieldType.DateTime) || this;
  }
  DateTimeField.prototype.getunixTime = function() {
    if (this.value === undefined) {
      return 0;
    }
    // div by 1000 to convert to seconds
    return this.value.getTime() / 1000;
  };
  DateTimeField.prototype.fromUnixTime = function(unix) {
    if (unix === 0) {
      // now
      this.value = undefined;
    } else {
      // mul by 1000 to convert to milliseconds
      this.value = new Date(unix * 1000);
    }
  };
  return DateTimeField;
})(forms_1.Field);
exports.DateTimeField = DateTimeField;
//# sourceMappingURL=DateTimeField.js.map
