"use strict";
// TODO: additional options (use DAOcreator, etc)
/* eslint-disable */
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = require("../../dependency/web3");
var migrate = require("@daostack/migration/migrate-dao");
var addresses = require("@daostack/migration/migration.json");
var arcVersion = require("@daostack/migration/package.json").dependencies[
  "@daostack/arc"
];
exports.migrateDAO = function(dao, callbacks) {
  return __awaiter(_this, void 0, void 0, function() {
    var web3, opts, network, logTx, migration, result, e_1;
    var _this = this;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, web3_1.getWeb3()];
        case 1:
          web3 = _a.sent();
          return [4 /*yield*/, web3_1.getDefaultOpts()];
        case 2:
          opts = _a.sent();
          return [4 /*yield*/, web3_1.getNetworkName()];
        case 3:
          network = _a.sent();
          logTx = function(_a, msg) {
            var transactionHash = _a.transactionHash,
              gasUsed = _a.gasUsed;
            return __awaiter(_this, void 0, void 0, function() {
              var tx, gasPrice, txCost;
              return __generator(this, function(_b) {
                switch (_b.label) {
                  case 0:
                    return [
                      4 /*yield*/,
                      web3.eth.getTransaction(transactionHash)
                    ];
                  case 1:
                    tx = _b.sent();
                    if (tx != null) {
                      gasPrice = tx.gasPrice;
                      txCost = web3.utils.fromWei(
                        (gasUsed * gasPrice).toString(),
                        "ether"
                      );
                      callbacks.txComplete(msg, transactionHash, txCost);
                    }
                    return [2 /*return*/];
                }
              });
            });
          };
          // Report back to caller the version of Arc being used
          callbacks.info("Using Arc Version: " + arcVersion);
          _a.label = 4;
        case 4:
          _a.trys.push([4, 6, , 7]);
          return [
            4 /*yield*/,
            migrate({
              migrationParams: dao,
              web3: web3,
              spinner: {
                start: callbacks.info,
                fail: callbacks.error
              },
              confirm: callbacks.userApproval,
              logTx: logTx,
              opts: opts,
              previousMigration: __assign({}, addresses[network]),
              customabislocation: undefined
            })
          ];
        case 5:
          migration = _a.sent();
          if (migration === undefined) {
            throw Error(
              "Something terrible has gone wrong! Please be sure to hit 'yes' on the prompts asking" +
                " for your approval. If this isn't your issue, please report this as a bug."
            );
          }
          result = migration.dao[arcVersion];
          console.log(result);
          return [
            2 /*return*/,
            {
              arcVersion: arcVersion,
              name: result.name,
              Avatar: result.Avatar,
              DAOToken: result.DAOToken,
              Reputation: result.Reputation,
              Controller: result.Controller
            }
          ];
        case 6:
          e_1 = _a.sent();
          callbacks.migrationAborted(e_1);
          return [2 /*return*/, undefined];
        case 7:
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=migration.js.map
