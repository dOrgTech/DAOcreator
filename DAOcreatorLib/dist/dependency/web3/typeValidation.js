"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Web3Utils = require("web3-utils");
exports.isAddress = function(address) {
  var addr = address.toLowerCase();
  return addr[0] === "0" && addr[1] === "x" && Web3Utils.isAddress(addr);
};
exports.isBN = function(number) {
  return Web3Utils.isBN(number);
};
//# sourceMappingURL=typeValidation.js.map
