"use strict";
import OpenAI from "openai";

/**
 * OpenAI moderation client wrapper.
 *
 * @class
 */
class ModerationClient {
  /**
   * Initializes a new moderation client.
   *
   * @param {string} moderationApiKey - OpenAI API key used for the moderation endpoint.
   */
  constructor(moderationApiKey) {
    this.openAI = new OpenAI({
      apiKey: moderationApiKey,
    });
  }

  /**
   * Use OpenAI's moderation API to check if the message violates content policy.
   *
   * @param {string} message - Message text to moderate.
   * @returns {Promise<object>} Moderation result object.
   */
  async moderate(message) {
    try {
      const moderation = await this.openAI.moderations.create({
        input: message,
      });
      const result = moderation.results[0];
      return {
        flagged: result.flagged,
        categories: result.categories,
        category_scores: result.category_scores,
        message: message,
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        error = new Error(
          `An OpenAI error has occurred: ${error.status} ${error.type} ${error.code} ${error.message}`,
        );
      }
      throw error;
    }
  }
}

export { ModerationClient as default };
