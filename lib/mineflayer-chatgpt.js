"use strict";
import Client from "./client.js";
import Memory from "./memory.js";
import moderator from "./moderator.js";

const DEFAULT_ENABLE_MODERATION = true;
const DEFAULT_ENABLE_MESSAGE_LOGGING = false;
const DEFAULT_MINIMUM_CONFIDENCE_SCORE = 0.9;
const DEFAULT_COOL_DOWN_IN_SECONDS = 15;
const DEFAULT_FALLBACK_MESSAGE =
  "Sorry, I cannot provide a response to that message.";

let memory;

/**
 * Register the Mineflayer ChatGPT plugin on a bot instance.
 *
 * @param {object} bot - Mineflayer bot instance.
 */
function chatgpt(bot) {
  let client;
  let enableModeration;
  let enableMessageLogging;
  let minimumConfidenceScore;
  let coolDownInSeconds;
  let fallbackMessage;

  bot.chatgpt = {};

  /**
   * Configure the plugin instance.
   *
   * @param {string} apiKey - OpenAI API key.
   * @param {object} [opts={}] - Plugin options.
   */
  bot.chatgpt.setConfig = (apiKey, opts) => {
    opts = opts || {};
    enableModeration = opts.enableModeration ?? DEFAULT_ENABLE_MODERATION;
    enableMessageLogging =
      opts.enableMessageLogging ?? DEFAULT_ENABLE_MESSAGE_LOGGING;
    minimumConfidenceScore =
      opts.minimumConfidenceScore ?? DEFAULT_MINIMUM_CONFIDENCE_SCORE;
    coolDownInSeconds = opts.coolDownInSeconds ?? DEFAULT_COOL_DOWN_IN_SECONDS;
    fallbackMessage = opts.fallbackMessage || DEFAULT_FALLBACK_MESSAGE;
    client = new Client(apiKey, opts);
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
          client.openAI,
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

      const chatResult = await client.chat(memory, player, message);
      let reply = chatResult.reply;
      const confidenceScore = chatResult.confidenceScore;

      if (enableModeration === true) {
        const moderatedInbound = await moderator.moderateInboundReply(
          client.openAI,
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
