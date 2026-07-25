"use strict";
import MessageClient from "./message-client.js";
import ModerationClient from "./moderation-client.js";
import Memory from "./memory.js";
import moderator from "./moderator.js";

const DEFAULT_ENABLE_MODERATION = true;
const DEFAULT_ENABLE_MESSAGE_LOGGING = false;
const DEFAULT_MINIMUM_CONFIDENCE_SCORE = 0.9;
const DEFAULT_COOL_DOWN_IN_SECONDS = 15;
const DEFAULT_FALLBACK_MESSAGE =
  "Sorry, I cannot provide a response to that message.";
const DEFAULT_ENABLE_SECURITY_INSTRUCTIONS = true;

let memory;

/**
 * Register the Mineflayer ChatGPT plugin on a bot instance.
 *
 * @param {object} bot - Mineflayer bot instance.
 */
function chatgpt(bot) {
  let messageClient;
  let moderationClient;
  let enableModeration;
  let enableMessageLogging;
  let minimumConfidenceScore;
  let coolDownInSeconds;
  let fallbackMessage;

  bot.chatgpt = {};

  /**
   * Configure the plugin instance.
   *
   * @param {object} [opts={}] - Plugin options.
   * @param {string} opts.messageApiKey - API key for the chat completion endpoint. Can be a placeholder value when `messageBaseURL` points at a local LLM server (e.g. vMLX) that doesn't require authentication.
   * @param {string} [opts.moderationApiKey] - OpenAI API key used for moderation. Required when `enableModeration` is `true`.
   * @param {string} [opts.messageBaseURL] - Base URL of the chat completion endpoint. Set this to use a local OpenAI-compatible LLM server (e.g. vMLX) instead of OpenAI.
   */
  bot.chatgpt.setConfig = (opts) => {
    opts = opts || {};
    enableModeration = opts.enableModeration ?? DEFAULT_ENABLE_MODERATION;
    enableMessageLogging =
      opts.enableMessageLogging ?? DEFAULT_ENABLE_MESSAGE_LOGGING;
    minimumConfidenceScore =
      opts.minimumConfidenceScore ?? DEFAULT_MINIMUM_CONFIDENCE_SCORE;
    coolDownInSeconds = opts.coolDownInSeconds ?? DEFAULT_COOL_DOWN_IN_SECONDS;
    fallbackMessage = opts.fallbackMessage || DEFAULT_FALLBACK_MESSAGE;
    opts.enableSecurityInstructions =
      opts.enableSecurityInstructions ?? DEFAULT_ENABLE_SECURITY_INSTRUCTIONS;
    messageClient = new MessageClient(opts.messageApiKey, {
      model: opts.model,
      instructions: opts.instructions,
      enableSecurityInstructions: opts.enableSecurityInstructions,
      baseURL: opts.messageBaseURL,
    });
    if (enableModeration === true) {
      moderationClient = new ModerationClient(opts.moderationApiKey);
    }
    memory = new Memory(opts.historySize);
  };

  /**
   * Send a message through the plugin and return the final reply.
   *
   * @param {string} player - Player name or id.
   * @param {string} message - Message to send.
   * @returns {Promise<string>} Final reply text.
   */
  bot.chatgpt.sendMessage = async (player, message) => {
    try {
      if (enableModeration === true) {
        const moderatedOutbound = await moderator.moderateOutboundMessage(
          moderationClient,
          memory,
          player,
          message,
          fallbackMessage,
          coolDownInSeconds,
        );
        if (moderatedOutbound.flagged) {
          return moderatedOutbound.message;
        }
        message = moderatedOutbound.message;
      }

      console.log("---------> Sending message to ChatGPT:", message);

      const chatResult = await messageClient.chat(memory, player, message);
      let reply = chatResult.reply;
      const confidenceScore = chatResult.confidenceScore;

      if (enableModeration === true) {
        const moderatedInbound = await moderator.moderateInboundReply(
          moderationClient,
          reply,
          fallbackMessage,
          confidenceScore,
          minimumConfidenceScore,
        );
        reply = moderatedInbound.reply;
      }
      if (enableMessageLogging === true) {
        console.log(`Player ${player} received a reply from ChatGPT: ${reply}`);
      }
      return reply;
    } catch (error) {
      console.error(`An unexpected error has occurred: ${error.message}`);
      throw error;
    }
  };
}

const exports = {
  chatgpt: chatgpt,
};

export { exports as default };
