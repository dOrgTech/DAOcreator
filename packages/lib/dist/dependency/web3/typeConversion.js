"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EthJsUnits = require("ethjs-unit");
var bn_js_1 = require("bn.js");
exports.toBN = function(number, base, endian) {
  return new bn_js_1.default(number, base, endian);
};
exports.fromWei = function(wei) {
  return EthJsUnits.fromWei(wei, "ether");
};
exports.toWei = function(eth) {
  return EthJsUnits.toWei(eth, "ether");
};
//# sourceMappingURL=typeConversion.js.map
