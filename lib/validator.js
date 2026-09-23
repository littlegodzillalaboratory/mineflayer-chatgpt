"use strict";

/**
 * Validate the minimum confidence score used to flag jailbreak attempts.
 * The score must be a finite number in the inclusive range from 0 to 1.
 *
 * @param {number} minimumJailbreakConfidenceScore - Confidence score to validate.
 * @returns {number} The validated confidence score.
 * @throws {RangeError} When the score is not a finite number from 0 to 1.
 */
function validateJailbreakConfidenceScore(minimumJailbreakConfidenceScore) {
  if (
    typeof minimumJailbreakConfidenceScore !== "number" ||
    !Number.isFinite(minimumJailbreakConfidenceScore) ||
    minimumJailbreakConfidenceScore < 0 ||
    minimumJailbreakConfidenceScore > 1
  ) {
    throw new RangeError(
      "minimumJailbreakConfidenceScore must be between 0 and 1",
    );
  }

  return minimumJailbreakConfidenceScore;
}

export { validateJailbreakConfidenceScore };
