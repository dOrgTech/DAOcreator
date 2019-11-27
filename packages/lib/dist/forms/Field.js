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
var FieldType;
(function(FieldType) {
  FieldType[(FieldType["String"] = 0)] = "String";
  FieldType[(FieldType["Token"] = 1)] = "Token";
  FieldType[(FieldType["DateTime"] = 2)] = "DateTime";
  FieldType[(FieldType["Duration"] = 3)] = "Duration";
  FieldType[(FieldType["Address"] = 4)] = "Address";
  FieldType[(FieldType["Percentage"] = 5)] = "Percentage";
})((FieldType = exports.FieldType || (exports.FieldType = {})));
var Field = /** @class */ (function(_super) {
  __extends(Field, _super);
  function Field(init, type) {
    var _this = _super.call(this, init) || this;
    _this._description = "";
    _this._displayName = "";
    _this._story = "";
    _this._type = type;
    return _this;
  }
  Field.prototype.setDescription = function(description) {
    this._description = description;
    return this;
  };
  Object.defineProperty(Field.prototype, "description", {
    get: function() {
      return this._description;
    },
    enumerable: true,
    configurable: true
  });
  Field.prototype.setDisplayName = function(displayName) {
    this._displayName = displayName;
    return this;
  };
  Object.defineProperty(Field.prototype, "displayName", {
    get: function() {
      return this._displayName;
    },
    enumerable: true,
    configurable: true
  });
  Field.prototype.setStory = function(story) {
    this._story = story;
    return this;
  };
  Object.defineProperty(Field.prototype, "story", {
    get: function() {
      return this._story;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Field.prototype, "type", {
    get: function() {
      return this._type;
    },
    enumerable: true,
    configurable: true
  });
  return Field;
})(formstate_1.FieldState);
exports.Field = Field;
//# sourceMappingURL=Field.js.map
