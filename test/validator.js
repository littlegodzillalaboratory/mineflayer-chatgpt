"use strict";
import assert from "assert";
import {
  validateCoolDownInSeconds,
  validateEnableMessageLogging,
  validateEnableModeration,
  validateEnableSecurityInstructions,
  validateFallbackMessage,
  validateJailbreakConfidenceScore,
  validateReplyConfidenceScore,
} from "../lib/validator.js";

for (const [name, validate] of [
  ["validateEnableModeration", validateEnableModeration],
  ["validateEnableMessageLogging", validateEnableMessageLogging],
  ["validateEnableSecurityInstructions", validateEnableSecurityInstructions],
]) {
  describe(`validator - ${name}`, function () {
    it("should accept boolean values", function () {
      assert.equal(validate(true), true);
      assert.equal(validate(false), false);
    });

    for (const invalidValue of [0, 1, "true", null, undefined]) {
      it(`should reject non-boolean value ${String(invalidValue)}`, function () {
        assert.throws(() => validate(invalidValue), TypeError);
      });
    }
  });
}

describe("validator - validateCoolDownInSeconds", function () {
  it("should accept finite, non-negative numbers", function () {
    assert.equal(validateCoolDownInSeconds(0), 0);
    assert.equal(validateCoolDownInSeconds(15), 15);
    assert.equal(validateCoolDownInSeconds(0.5), 0.5);
  });

  for (const invalidValue of [-0.1, Infinity, -Infinity, NaN, "15"]) {
    it(`should reject invalid cooldown ${String(invalidValue)}`, function () {
      assert.throws(() => validateCoolDownInSeconds(invalidValue), {
        name: "RangeError",
        message: "coolDownInSeconds must be a non-negative finite number",
      });
    });
  }
});

describe("validator - validateFallbackMessage", function () {
  it("should accept a non-empty string", function () {
    assert.equal(
      validateFallbackMessage("Please try again."),
      "Please try again.",
    );
  });

  for (const invalidValue of ["", 0, false, null, undefined]) {
    it(`should reject invalid fallback message ${String(invalidValue)}`, function () {
      assert.throws(() => validateFallbackMessage(invalidValue), {
        name: "TypeError",
        message: "fallbackMessage must be a non-empty string",
      });
    });
  }
});

describe("validator - validateJailbreakConfidenceScore", function () {
  it("should accept the inclusive confidence score boundaries", function () {
    assert.equal(validateJailbreakConfidenceScore(0), 0);
    assert.equal(validateJailbreakConfidenceScore(1), 1);
  });

  it("should accept a finite confidence score between the boundaries", function () {
    assert.equal(validateJailbreakConfidenceScore(0.7), 0.7);
  });

  for (const invalidScore of [-0.1, 1.1, Infinity, -Infinity, NaN, "0.7"]) {
    it(`should reject invalid confidence score ${String(invalidScore)}`, function () {
      assert.throws(() => validateJailbreakConfidenceScore(invalidScore), {
        name: "RangeError",
        message: "minimumJailbreakConfidenceScore must be between 0 and 1",
      });
    });
  }
});

describe("validator - validateReplyConfidenceScore", function () {
  it("should accept the inclusive confidence score boundaries", function () {
    assert.equal(validateReplyConfidenceScore(0), 0);
    assert.equal(validateReplyConfidenceScore(1), 1);
  });

  it("should accept a finite confidence score between the boundaries", function () {
    assert.equal(validateReplyConfidenceScore(0.9), 0.9);
  });

  for (const invalidScore of [-0.1, 1.1, Infinity, -Infinity, NaN, "0.9"]) {
    it(`should reject invalid confidence score ${String(invalidScore)}`, function () {
      assert.throws(() => validateReplyConfidenceScore(invalidScore), {
        name: "RangeError",
        message: "minimumReplyConfidenceScore must be between 0 and 1",
      });
    });
  }
});
