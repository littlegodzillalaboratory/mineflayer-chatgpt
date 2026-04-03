"use strict";
import Client from "./client.js";
import Memory from "./memory.js";
import moderator from "./moderator.js";

let memory;

function chatgpt(bot) {

  let client;
  let enableModeration;

  bot.chatgpt = {};

  bot.chatgpt.setConfig = (apiKey, opts) => {
    opts = opts || {};
    enableModeration = opts.enableModeration || true;
    client = new Client(apiKey, opts);
    memory = new Memory(opts.historySize);
  };

  bot.chatgpt.sendMessage = async (player, message) => {
    try {
      let reply = await client.chat(memory, player, message);
      if (enableModeration === true) {
        reply = moderator.sanitiseProfanity(reply);
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
