"use strict";
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
var web3_1 = require("web3");
var typeValidation = require("./typeValidation");
var typeConversion = require("./typeConversion");
exports.TypeValidation = typeValidation;
exports.TypeConversion = typeConversion;
var readyWeb3;
exports.getWeb3 = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var accounts, ethereum, web3, accounts, error_1, accounts;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          if (!(readyWeb3 != null)) return [3 /*break*/, 2];
          return [4 /*yield*/, readyWeb3.eth.getAccounts()];
        case 1:
          accounts = _a.sent();
          readyWeb3.eth.defaultAccount = accounts[0];
          return [2 /*return*/, readyWeb3];
        case 2:
          ethereum = window.ethereum;
          web3 = window.web3;
          if (!ethereum) return [3 /*break*/, 8];
          _a.label = 3;
        case 3:
          _a.trys.push([3, 6, , 7]);
          // Request account access if needed
          return [4 /*yield*/, ethereum.enable()];
        case 4:
          // Request account access if needed
          _a.sent();
          // Acccounts now exposed
          readyWeb3 = new web3_1.default(ethereum);
          return [4 /*yield*/, readyWeb3.eth.getAccounts()];
        case 5:
          accounts = _a.sent();
          readyWeb3.eth.defaultAccount = accounts[0];
          return [3 /*break*/, 7];
        case 6:
          error_1 = _a.sent();
          return [
            2 /*return*/,
            Promise.reject("User denied account access...")
          ];
        case 7:
          return [3 /*break*/, 11];
        case 8:
          if (!web3) return [3 /*break*/, 10];
          readyWeb3 = new web3_1.default(web3.currentProvider);
          return [4 /*yield*/, readyWeb3.eth.getAccounts()];
        case 9:
          accounts = _a.sent();
          readyWeb3.eth.defaultAccount = accounts[0];
          return [3 /*break*/, 11];
        case 10:
          return [
            2 /*return*/,
            Promise.reject(
              "Non-Ethereum browser detected. You should consider trying MetaMask!"
            )
          ];
        case 11:
          return [2 /*return*/, readyWeb3];
      }
    });
  });
};
exports.getDefaultOpts = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var web3, block;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, exports.getWeb3()];
        case 1:
          web3 = _a.sent();
          return [4 /*yield*/, web3.eth.getBlock("latest")];
        case 2:
          block = _a.sent();
          return [
            2 /*return*/,
            {
              from: web3.eth.defaultAccount,
              gas: block.gasLimit - 100000,
              gasPrice: web3.utils.toWei("7", "gwei")
            }
          ];
      }
    });
  });
};
exports.getNetworkName = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var web3, network;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, exports.getWeb3()];
        case 1:
          web3 = _a.sent();
          return [4 /*yield*/, web3.eth.net.getNetworkType()];
        case 2:
          network = _a.sent();
          if (network === "main") {
            network = "mainnet";
          }
          return [2 /*return*/, network];
      }
    });
  });
};
exports.keccak256 = function(value) {
  if (readyWeb3 == null) {
    throw Error("Web3 not initialized. Please call 'getWeb3'");
  }
  if (typeof value === "string") {
    return readyWeb3.utils.keccak256(value);
  } else {
    return readyWeb3.utils.keccak256(value.toString());
  }
};
exports.encodeParameters = function(types, parameters) {
  if (readyWeb3 == null) {
    throw Error("Web3 not initialized. Please call 'getWeb3'");
  }
  return readyWeb3.eth.abi.encodeParameters(types, parameters);
};
//# sourceMappingURL=index.js.map
