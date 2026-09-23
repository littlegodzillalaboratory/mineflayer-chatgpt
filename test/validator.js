"use strict";
import assert from "assert";
import { validateJailbreakConfidenceScore } from "../lib/validator.js";

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
