"use strict";
import Client from "./client.js";
import Memory from "./memory.js";
import moderator from "./moderator.js";

const DEFAULT_ENABLE_MODERATION = true;
const DEFAULT_ENABLE_MESSAGE_LOGGING = false;
const DEFAULT_FALLBACK_MESSAGE =
  "Sorry, I cannot provide a response to that message.";

let memory;

function chatgpt(bot) {
  let client;
  let enableModeration;
  let enableMessageLogging;
  let fallbackMessage;

  bot.chatgpt = {};

  bot.chatgpt.setConfig = (apiKey, opts) => {
    opts = opts || {};
    enableModeration = opts.enableModeration ?? DEFAULT_ENABLE_MODERATION;
    enableMessageLogging =
      opts.enableMessageLogging ?? DEFAULT_ENABLE_MESSAGE_LOGGING;
    fallbackMessage = opts.fallbackMessage || DEFAULT_FALLBACK_MESSAGE;
    client = new Client(apiKey, opts);
    memory = new Memory(opts.historySize);
  };

  bot.chatgpt.sendMessage = async (player, message) => {
    try {
      if (enableModeration === true) {
        message = moderator.sanitiseProfanity(message);
        const moderation = await moderator.moderateMessage(message);
        if (moderation.flagged) {
          console.warn(
            `Message flagged by moderation: ${JSON.stringify(moderation)}`,
          );
          return fallbackMessage;
        }
      }

      let reply = await client.chat(memory, player, message);
      if (enableModeration === true) {
        reply = moderator.sanitiseProfanity(reply);
        const moderation = await moderator.moderateMessage(reply);
        if (moderation.flagged) {
          console.warn(
            `Reply flagged by moderation: ${JSON.stringify(moderation)}`,
          );
          reply = fallbackMessage;
        }
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
