"use strict";

/**
 * Validate whether moderation is enabled.
 *
 * @param {boolean} enableModeration - Moderation setting to validate.
 * @returns {boolean} The validated setting.
 * @throws {TypeError} When the setting is not a boolean.
 */
function validateEnableModeration(enableModeration) {
  if (typeof enableModeration !== "boolean") {
    throw new TypeError("enableModeration must be a boolean");
  }

  return enableModeration;
}

/**
 * Validate whether model reply logging is enabled.
 *
 * @param {boolean} enableMessageLogging - Reply logging setting to validate.
 * @returns {boolean} The validated setting.
 * @throws {TypeError} When the setting is not a boolean.
 */
function validateEnableMessageLogging(enableMessageLogging) {
  if (typeof enableMessageLogging !== "boolean") {
    throw new TypeError("enableMessageLogging must be a boolean");
  }

  return enableMessageLogging;
}

/**
 * Validate the minimum delay between player messages.
 * The delay must be a finite, non-negative number of seconds.
 *
 * @param {number} coolDownInSeconds - Cooldown duration to validate.
 * @returns {number} The validated cooldown duration.
 * @throws {RangeError} When the duration is not finite or is negative.
 */
function validateCoolDownInSeconds(coolDownInSeconds) {
  if (
    typeof coolDownInSeconds !== "number" ||
    !Number.isFinite(coolDownInSeconds) ||
    coolDownInSeconds < 0
  ) {
    throw new RangeError(
      "coolDownInSeconds must be a non-negative finite number",
    );
  }

  return coolDownInSeconds;
}

/**
 * Validate the message returned when a reply cannot be provided.
 *
 * @param {string} fallbackMessage - Fallback message to validate.
 * @returns {string} The validated fallback message.
 * @throws {TypeError} When the message is not a non-empty string.
 */
function validateFallbackMessage(fallbackMessage) {
  if (typeof fallbackMessage !== "string" || fallbackMessage.length === 0) {
    throw new TypeError("fallbackMessage must be a non-empty string");
  }

  return fallbackMessage;
}

/**
 * Validate whether security instructions are enabled.
 *
 * @param {boolean} enableSecurityInstructions - Security instruction setting to validate.
 * @returns {boolean} The validated setting.
 * @throws {TypeError} When the setting is not a boolean.
 */
function validateEnableSecurityInstructions(enableSecurityInstructions) {
  if (typeof enableSecurityInstructions !== "boolean") {
    throw new TypeError("enableSecurityInstructions must be a boolean");
  }

  return enableSecurityInstructions;
}

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

/**
 * Validate the minimum confidence score accepted for model replies.
 * The score must be a finite number in the inclusive range from 0 to 1.
 *
 * @param {number} minimumReplyConfidenceScore - Confidence score to validate.
 * @returns {number} The validated confidence score.
 * @throws {RangeError} When the score is not a finite number from 0 to 1.
 */
function validateReplyConfidenceScore(minimumReplyConfidenceScore) {
  if (
    typeof minimumReplyConfidenceScore !== "number" ||
    !Number.isFinite(minimumReplyConfidenceScore) ||
    minimumReplyConfidenceScore < 0 ||
    minimumReplyConfidenceScore > 1
  ) {
    throw new RangeError("minimumReplyConfidenceScore must be between 0 and 1");
  }

  return minimumReplyConfidenceScore;
}

export {
  validateCoolDownInSeconds,
  validateEnableMessageLogging,
  validateEnableModeration,
  validateEnableSecurityInstructions,
  validateFallbackMessage,
  validateJailbreakConfidenceScore,
  validateReplyConfidenceScore,
};
