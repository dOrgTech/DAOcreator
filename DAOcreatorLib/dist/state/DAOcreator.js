"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arc_1 = require("../dependency/arc");
var arc_2 = require("../dependency/arc");
exports.SchemeType = arc_2.SchemeType;
exports.ContributionReward = arc_2.ContributionReward;
exports.SchemeRegistrar = arc_2.SchemeRegistrar;
exports.GenericScheme = arc_2.GenericScheme;
exports.GenesisProtocol = arc_2.GenesisProtocol;
exports.GenesisProtocolPreset = arc_2.GenesisProtocolPreset;
exports.toDAOMigrationParams = function(dao) {
  var config = dao.config,
    members = dao.members,
    schemes = dao.schemes;
  var params = {
    orgName: config.daoName,
    tokenName: config.tokenName,
    tokenSymbol: config.tokenSymbol,
    unregisterOwner: true,
    useUController: false,
    useDaoCreator: true,
    schemes: {},
    VotingMachinesParams: [],
    founders: []
  };
  // schemes & voting machine params
  for (var _i = 0, schemes_1 = schemes; _i < schemes_1.length; _i++) {
    var scheme = schemes_1[_i];
    switch (scheme.type) {
      case arc_1.SchemeType.ContributionReward: {
        if (!params.ContributionReward) {
          params.ContributionReward = [];
        }
        params.ContributionReward.push({
          voteParams: params.VotingMachinesParams.length
        });
        params.schemes.ContributionReward = true;
        break;
      }
      case arc_1.SchemeType.GenericScheme: {
        var genericScheme = scheme;
        if (!params.UGenericScheme) {
          params.UGenericScheme = [];
        }
        params.UGenericScheme.push({
          voteParams: params.VotingMachinesParams.length,
          targetContract: genericScheme.contractToCall
        });
        params.schemes.UGenericScheme = true;
        break;
      }
      case arc_1.SchemeType.SchemeRegistrar: {
        if (!params.SchemeRegistrar) {
          params.SchemeRegistrar = [];
        }
        params.SchemeRegistrar.push({
          voteRegisterParams: params.VotingMachinesParams.length,
          voteRemoveParams: params.VotingMachinesParams.length
        });
        params.schemes.SchemeRegistrar = true;
        break;
      }
    }
    var genProtocol = scheme.votingMachine;
    params.VotingMachinesParams.push(genProtocol.config);
  }
  for (var _a = 0, members_1 = members; _a < members_1.length; _a++) {
    var member = members_1[_a];
    params.founders.push(member);
  }
  return params;
};
exports.fromDAOMigrationParams = function(params) {
  // config
  var config = {
    daoName: params.orgName,
    tokenSymbol: params.tokenSymbol,
    tokenName: params.tokenName
  };
  // members
  var members = [];
  for (var _i = 0, _a = params.founders; _i < _a.length; _i++) {
    var member = _a[_i];
    members.push({
      address: member.address,
      tokens: member.tokens ? member.tokens : 0,
      reputation: member.reputation
    });
  }
  // schemes
  var schemes = [];
  Object.keys(params.schemes).forEach(function(type) {
    // TODO: support multiple schemes of a single type
    switch (type) {
      case "ContributionReward":
        if (params.schemes[type]) {
          var config_1 = params.ContributionReward
            ? params.ContributionReward[0]
            : undefined;
          var index = void 0;
          if (config_1 && config_1.voteParams) {
            index = config_1.voteParams;
          } else {
            index = 0;
          }
          var votingMachine = new arc_1.GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });
          schemes.push(new arc_1.ContributionReward(votingMachine));
        }
        break;
      case "UGenericScheme":
        if (params.schemes[type]) {
          var config_2 = params.UGenericScheme
            ? params.UGenericScheme[0]
            : undefined;
          var index = void 0;
          var address = void 0;
          if (config_2 && config_2.voteParams) {
            index = config_2.voteParams;
          } else {
            index = 0;
          }
          if (config_2 && config_2.targetContract) {
            address = config_2.targetContract;
          } else {
            address = "0x0000000000000000000000000000000000000000";
          }
          var votingMachine = new arc_1.GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });
          schemes.push(new arc_1.GenericScheme(address, votingMachine));
        }
        break;
      case "SchemeRegistrar":
        if (params.schemes[type]) {
          var config_3 = params.SchemeRegistrar
            ? params.SchemeRegistrar[0]
            : undefined;
          var index = void 0;
          if (config_3) {
            if (config_3.voteRegisterParams) {
              index = config_3.voteRegisterParams;
            } else if (config_3.voteRemoveParams) {
              index = config_3.voteRemoveParams;
            } else {
              index = 0;
            }
          } else {
            index = 0;
          }
          var votingMachine = new arc_1.GenesisProtocol({
            config: params.VotingMachinesParams[index]
          });
          schemes.push(new arc_1.SchemeRegistrar(votingMachine));
        }
        break;
      default:
        break;
    }
  });
  return {
    config: config,
    members: members,
    schemes: schemes
  };
};
//# sourceMappingURL=DAOcreator.js.map
