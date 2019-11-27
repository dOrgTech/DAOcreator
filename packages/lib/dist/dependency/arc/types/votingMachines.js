"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GenesisProtocolPreset;
(function(GenesisProtocolPreset) {
  GenesisProtocolPreset[(GenesisProtocolPreset["Easy"] = 1)] = "Easy";
  GenesisProtocolPreset[(GenesisProtocolPreset["Normal"] = 2)] = "Normal";
  GenesisProtocolPreset[(GenesisProtocolPreset["Critical"] = 3)] = "Critical";
})(
  (GenesisProtocolPreset =
    exports.GenesisProtocolPreset || (exports.GenesisProtocolPreset = {}))
);
var GenesisProtocol = /** @class */ (function() {
  function GenesisProtocol(opts) {
    this.typeName = "GenesisProtocol";
    if (opts.preset) {
      if (typeof opts.preset === "string") {
        opts.preset = Number(opts.preset);
      }
      this.preset = opts.preset;
      switch (opts.preset) {
        case GenesisProtocolPreset.Easy:
          this.config = GenesisProtocol.EasyConfig;
          break;
        case GenesisProtocolPreset.Normal:
          this.config = GenesisProtocol.NormalConfig;
          break;
        case GenesisProtocolPreset.Critical:
          this.config = GenesisProtocol.CriticalConfig;
          break;
        default:
          throw Error("Preset not implemented.");
      }
    } else if (opts.config) {
      this.config = opts.config;
    } else {
      throw Error(
        "Invalid construction arguments. Please use a custom config or a preset."
      );
    }
  }
  Object.defineProperty(GenesisProtocol, "EasyConfig", {
    get: function() {
      return {
        boostedVotePeriodLimit: 129600,
        daoBountyConst: 10,
        minimumDaoBounty: 50,
        queuedVotePeriodLimit: 604800,
        queuedVoteRequiredPercentage: 50,
        preBoostedVotePeriodLimit: 43200,
        proposingRepReward: 10,
        quietEndingPeriod: 86400,
        thresholdConst: 1200,
        votersReputationLossRatio: 1,
        voteOnBehalf: "0x0000000000000000000000000000000000000000",
        activationTime: 0
      };
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(GenesisProtocol, "NormalConfig", {
    get: function() {
      return {
        boostedVotePeriodLimit: 345600,
        daoBountyConst: 10,
        minimumDaoBounty: 150,
        queuedVotePeriodLimit: 2592000,
        queuedVoteRequiredPercentage: 50,
        preBoostedVotePeriodLimit: 86400,
        proposingRepReward: 50,
        quietEndingPeriod: 172800,
        thresholdConst: 1200,
        votersReputationLossRatio: 4,
        voteOnBehalf: "0x0000000000000000000000000000000000000000",
        activationTime: 0
      };
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(GenesisProtocol, "CriticalConfig", {
    get: function() {
      return {
        boostedVotePeriodLimit: 691200,
        daoBountyConst: 10,
        minimumDaoBounty: 500,
        queuedVotePeriodLimit: 5184000,
        queuedVoteRequiredPercentage: 50,
        preBoostedVotePeriodLimit: 172800,
        proposingRepReward: 200,
        quietEndingPeriod: 345600,
        thresholdConst: 1500,
        votersReputationLossRatio: 4,
        voteOnBehalf: "0x0000000000000000000000000000000000000000",
        activationTime: 0
      };
    },
    enumerable: true,
    configurable: true
  });
  return GenesisProtocol;
})();
exports.GenesisProtocol = GenesisProtocol;
//# sourceMappingURL=votingMachines.js.map
