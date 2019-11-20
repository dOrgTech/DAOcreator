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
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var Form_1 = require("../../forms/Form");
var forms_1 = require("../../forms");
var csv_parse_1 = require("csv-parse");
var csv_stringify_1 = require("csv-stringify");
var MemberForm = /** @class */ (function(_super) {
  __extends(MemberForm, _super);
  function MemberForm(getDAOTokenSymbol, form) {
    var _this =
      _super.call(this, {
        address: new forms_1.AddressField(form ? form.$.address.value : "")
          .validators(
            forms_1.requiredText,
            forms_1.validAddress,
            forms_1.nonZeroAddress
          )
          .setDisplayName("Address")
          .setDescription("The member's public address."),
        reputation: new forms_1.TokenField(
          "REP",
          form ? form.$.reputation.value : ""
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThanOrEqual(0)
          )
          .setDisplayName("Reputation")
          .setDescription(
            "The member's reputation (voting power) within the DAO."
          ),
        tokens: new forms_1.TokenField(
          getDAOTokenSymbol,
          form ? form.$.tokens.value : ""
        )
          .validators(
            forms_1.requiredText,
            forms_1.validNumber,
            forms_1.greaterThanOrEqual(0)
          )
          .setDisplayName("Tokens")
          .setDescription("The number of DAO tokens this member owns.")
      }) || this;
    _this._getDAOTokenSymbol = getDAOTokenSymbol;
    return _this;
  }
  Object.defineProperty(MemberForm.prototype, "getDAOTokenSymbol", {
    get: function() {
      return this._getDAOTokenSymbol;
    },
    enumerable: true,
    configurable: true
  });
  MemberForm.prototype.toState = function() {
    return {
      address: this.$.address.value,
      tokens: Number(this.$.tokens.value),
      reputation: Number(this.$.reputation.value)
    };
  };
  MemberForm.prototype.fromState = function(state) {
    this.$.address.value = state.address;
    this.$.reputation.value = state.reputation.toString();
    this.$.tokens.value = state.tokens ? state.tokens.toString() : "0";
  };
  return MemberForm;
})(Form_1.Form);
exports.MemberForm = MemberForm;
var MembersForm = /** @class */ (function(_super) {
  __extends(MembersForm, _super);
  function MembersForm(getDAOTokenSymbol, form) {
    var _this = _super.call(this, form ? form.$ : []) || this;
    _this._getDAOTokenSymbol = getDAOTokenSymbol;
    _this.validators(
      forms_1.requireElement("Member"),
      forms_1.noDuplicates(
        function(a, b) {
          return (
            a.$.address.value.toLowerCase() === b.$.address.value.toLowerCase()
          );
        },
        function(value) {
          return value.$.address.value;
        }
      )
    );
    return _this;
  }
  Object.defineProperty(MembersForm.prototype, "getDAOTokenSymbol", {
    get: function() {
      return this._getDAOTokenSymbol;
    },
    enumerable: true,
    configurable: true
  });
  MembersForm.prototype.toState = function() {
    return this.$.map(function(member) {
      return member.toState();
    });
  };
  MembersForm.prototype.fromState = function(state) {
    var _this = this;
    this.$ = state.map(function(member) {
      var memberForm = new MemberForm(_this._getDAOTokenSymbol);
      memberForm.fromState(member);
      return memberForm;
    });
  };
  MembersForm.prototype.fromCSV = function(file) {
    return __awaiter(this, void 0, void 0, function() {
      var fileReader, csv, parseCSV;
      var _this = this;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            fileReader = new FileReader();
            fileReader.readAsText(file);
            return [
              4 /*yield*/,
              new Promise(function(resolve, reject) {
                return (fileReader.onloadend = function() {
                  return resolve();
                });
              })
            ];
          case 1:
            _a.sent();
            csv = fileReader.result;
            if (csv === null) {
              throw Error("Unable to read file.");
            }
            parseCSV = function(resolve, reject) {
              return function(error, rows) {
                if (error !== undefined) {
                  throw error;
                }
                if (!rows || rows.length === 0) {
                  reject(new Error("Empty CSV"));
                  return;
                }
                var colNames = Object.keys(rows[0]);
                // Verify all necessary columns are present
                ["address", "reputation", "tokens"].forEach(function(name) {
                  if (
                    colNames.findIndex(function(column) {
                      return column === name;
                    }) === -1
                  ) {
                    reject(new Error("Missing '" + name + "' column."));
                    return;
                  }
                });
                rows.forEach(function(row, index) {
                  return __awaiter(_this, void 0, void 0, function() {
                    var member, memberValidate;
                    return __generator(this, function(_a) {
                      switch (_a.label) {
                        case 0:
                          member = new MemberForm(this._getDAOTokenSymbol);
                          member.$.address.value = row.address.replace(
                            /\s/g,
                            ""
                          );
                          member.$.reputation.value = row.reputation.replace(
                            /\s/g,
                            ""
                          );
                          member.$.tokens.value = row.tokens.replace(/\s/g, "");
                          return [4 /*yield*/, member.validate()];
                        case 1:
                          memberValidate = _a.sent();
                          if (memberValidate.hasError) {
                            reject(
                              new Error(
                                "Invalid member on row " +
                                  index +
                                  ". Error: " +
                                  member.error
                              )
                            );
                            return [2 /*return*/];
                          }
                          // Add the member to ourselves
                          this.$.push(member);
                          // Validate the collection
                          return [4 /*yield*/, this.validate()];
                        case 2:
                          // Validate the collection
                          _a.sent();
                          if (this.hasError) {
                            reject(
                              new Error(
                                "Member on row " +
                                  index +
                                  " is invalid within the collection. Error: " +
                                  this.error
                              )
                            );
                            return [2 /*return*/];
                          }
                          if (index === rows.length - 1) {
                            resolve();
                          }
                          return [2 /*return*/];
                      }
                    });
                  });
                });
              };
            };
            return [
              4 /*yield*/,
              new Promise(function(resolve, reject) {
                csv_parse_1.default(
                  csv,
                  { columns: true },
                  parseCSV(resolve, reject)
                );
              })
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  MembersForm.prototype.toCSV = function() {
    var csvData = [["address", "reputation", "tokens"]].concat(
      this.$.map(function(member) {
        return [
          member.$.address.value,
          member.$.reputation.value,
          member.$.tokens.value
        ];
      })
    );
    return new Promise(function(resolve, reject) {
      csv_stringify_1.default(csvData, function(err, output) {
        if (output === undefined) {
          reject(new Error("CSV Stringify result should always be defined."));
        } else {
          resolve(output);
        }
      });
    });
  };
  return MembersForm;
})(Form_1.Form);
exports.MembersForm = MembersForm;
//# sourceMappingURL=MemberForm.js.map
