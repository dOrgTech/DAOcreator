"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = function(params) {
  return JSON.stringify(params, null, 2);
};
exports.fromJSON = function(params) {
  return JSON.parse(params);
};
//# sourceMappingURL=migration.js.map
