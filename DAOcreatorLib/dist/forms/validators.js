"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = require("../dependency/web3");
exports.requiredText = function(value) {
  var error = "This is required.";
  if (value == null || value.trim().length === 0) {
    return error;
  }
  return null;
};
exports.validAddress = function(value) {
  var error = "Please enter a valid address.";
  value = value.trim();
  if (!web3_1.TypeValidation.isAddress(value)) {
    return error;
  }
  return null;
};
exports.validTokenSymbol = function(value) {
  var error =
    "Token names must be all capitol letters and less than 4 characters.";
  value = value.trim();
  if (value.length > 4 || !/^[A-Z]+$/.test(value)) {
    return error;
  }
  return null;
};
exports.validBigNumber = function(value) {
  var error = "Please enter a valid whole number.";
  value = value.trim();
  try {
    web3_1.TypeConversion.toBN(value);
  } catch (e) {
    return error;
  }
  return null;
};
exports.validNumber = function(value) {
  var error = "Please enter a valid number.";
  value = value.trim();
  if (isNaN(Number(value))) {
    return error;
  }
  return null;
};
exports.validName = function(value) {
  var error = "Names must be less than 70 characters.";
  value = value.trim();
  if (value.length > 70) {
    return error;
  }
  return null;
};
exports.validPercentage = function(value) {
  var error = "Percentages must be between 0 and 100.";
  if (value > 100 || value < 0) {
    return error;
  }
  return null;
};
exports.validDuration = function(value) {
  var error = "Duration format is incorrect. Please use DD:hh:mm:ss";
  value = value.trim();
  var parts = value.split(":");
  if (parts.length !== 4) {
    return error;
  }
  return null;
};
exports.positiveDuration = function(value) {
  var error = null;
  value = value.trim();
  var parts = value.split(":");
  parts.forEach(function(part, index) {
    if (Number(part) < 0) {
      switch (index) {
        case 0:
          error = "Days cannot be negative.";
          return;
        case 1:
          error = "Hours cannot be negative.";
          return;
        case 2:
          error = "Minutes cannot be negative.";
          return;
        case 3:
          error = "Seconds cannot be negative.";
          return;
        default:
          throw Error("This should never happen.");
      }
    }
  });
  return error;
};
exports.futureDate = function(value) {
  var error = "Date must be in the future.";
  var currentTime = new Date().getTime();
  if (value && value.getTime() < currentTime) {
    return error;
  }
  return null;
};
exports.greaterThan = function(bound) {
  return function(value) {
    var error = "Number must be greater than " + bound + ".";
    value = value.trim();
    if (exports.validNumber(value) === null && Number(value) > bound) {
      return null;
    }
    return error;
  };
};
exports.greaterThanOrEqual = function(bound) {
  return function(value) {
    var error = "Number must be greater than or equal to " + bound + ".";
    value = value.trim();
    if (exports.validNumber(value) === null && Number(value) >= bound) {
      return null;
    }
    return error;
  };
};
exports.lessThanOrEqual = function(bound) {
  return function(value) {
    var error = "Number must be less than or equal to " + bound + ".";
    value = value.trim();
    if (exports.validNumber(value) === null && Number(value) <= bound) {
      return null;
    }
    return error;
  };
};
exports.nonZeroAddress = function(value) {
  var error = "Address must not be zero.";
  value = value.trim();
  if (value === "0x0000000000000000000000000000000000000000") {
    return error;
  }
  return null;
};
exports.requireElement = function(elementName) {
  return function(array) {
    return !array.length && "Please add a " + elementName + ".";
  };
};
exports.noDuplicates = function(evaluate, toString) {
  return function(array) {
    for (var i = 0; i < array.length; ++i) {
      var a = array[i];
      for (var k = 0; k < array.length; ++k) {
        if (k === i) continue;
        var b = array[k];
        if (evaluate(a, b)) {
          return "Duplicate entry detected: " + toString(a);
        }
      }
    }
  };
};
//# sourceMappingURL=validators.js.map
