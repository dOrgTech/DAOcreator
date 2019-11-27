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
// TODO: enforce formatting
// Format: DD:hh:mm:ss
var DurationField = /** @class */ (function(_super) {
  __extends(DurationField, _super);
  function DurationField(init) {
    var _this = _super.call(this, init, forms_1.FieldType.Duration) || this;
    _this.validators(forms_1.validDuration, forms_1.positiveDuration);
    return _this;
  }
  Object.defineProperty(DurationField.prototype, "days", {
    get: function() {
      var parts = this.value.split(":");
      return Number(parts[0]);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DurationField.prototype, "hours", {
    get: function() {
      var parts = this.value.split(":");
      return Number(parts[1]);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DurationField.prototype, "minutes", {
    get: function() {
      var parts = this.value.split(":");
      return Number(parts[2]);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(DurationField.prototype, "seconds", {
    get: function() {
      var parts = this.value.split(":");
      return Number(parts[3]);
    },
    enumerable: true,
    configurable: true
  });
  // TODO: put these constants somewhere (86400, 3600, etc)
  DurationField.prototype.toSeconds = function() {
    var parts = this.value.split(":");
    var days = Number(parts[0]);
    var hours = Number(parts[1]);
    var minutes = Number(parts[2]);
    var seconds = Number(parts[3]);
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  };
  DurationField.prototype.fromSeconds = function(seconds) {
    var days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;
    var hours = Math.trunc(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.trunc(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.trunc(seconds);
    this.value = days + ":" + hours + ":" + minutes + ":" + seconds;
  };
  return DurationField;
})(forms_1.Field);
exports.DurationField = DurationField;
//# sourceMappingURL=DurationField.js.map
