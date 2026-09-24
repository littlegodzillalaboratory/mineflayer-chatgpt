"use strict";
import { jailbreak } from "@openai/guardrails";
import OpenAI from "openai";

const JAILBREAK_MODEL = "gpt-5.6";
const JAILBREAK_MAX_TURNS = 10;

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
   * Create the OpenAI client adapter used by LLM-based guardrails.
   *
   * OpenAI Guardrails currently adds a temperature to GPT-5 requests. GPT-5.6
   * uses reasoning by default and does not accept that parameter, so the
   * adapter removes it before forwarding the request.
   *
   * @returns {object} OpenAI-compatible client for guardrail execution.
   */
  _createGuardrailLlm() {
    return {
      baseURL: this.openAI.baseURL,
      chat: {
        completions: {
          create: (params) => {
            params = { ...params };
            delete params.temperature;
            return this.openAI.chat.completions.create(params);
          },
        },
      },
    };
  }

  /**
   * Convert OpenAI and guardrail execution failures to a consistent error.
   *
   * @param {unknown} error - Error raised by OpenAI or OpenAI Guardrails.
   * @returns {Error} Normalized error.
   */
  _normalizeOpenAIError(error) {
    if (error instanceof OpenAI.APIError) {
      return new Error(
        `An OpenAI error has occurred: ${error.status} ${error.type} ${error.code} ${error.message}`,
        { cause: error },
      );
    }

    const message =
      error instanceof Error ? error.message : String(error || "Unknown error");
    return new Error(
      `An OpenAI error has occurred: ${message.replace(/^Error:\s*/, "")}`,
      { cause: error },
    );
  }

  /**
   * Use OpenAI Guardrails to detect a jailbreak attempt.
   *
   * @param {string} message - Message text to inspect.
   * @param {number} [minimumJailbreakConfidenceScore=0.7] - Minimum confidence required to flag the message.
   * @param {object[]} [conversationHistory=[]] - Recent conversation messages.
   * @returns {Promise<boolean>} True when the jailbreak tripwire is triggered.
   */
  async detectJailbreakAttempt(
    message,
    minimumJailbreakConfidenceScore = 0.7,
    conversationHistory = [],
  ) {
    try {
      const result = await jailbreak(
        {
          guardrailLlm: this._createGuardrailLlm(),
          getConversationHistory: () => conversationHistory,
        },
        message,
        {
          model: JAILBREAK_MODEL,
          confidence_threshold: minimumJailbreakConfidenceScore,
          include_reasoning: false,
          max_turns: JAILBREAK_MAX_TURNS,
        },
      );

      if (result.executionFailed) {
        throw result.originalException;
      }

      return result.tripwireTriggered;
    } catch (error) {
      throw this._normalizeOpenAIError(error);
    }
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
        throw this._normalizeOpenAIError(error);
      }
      throw error;
    }
  }
}

export { ModerationClient as default };
