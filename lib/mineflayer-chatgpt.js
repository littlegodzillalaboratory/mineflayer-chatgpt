"use strict";
import Client from "./client.js";
import Memory from "./memory.js";

const memory = new Memory();
let client;

function chatgpt(bot) {
  bot.chatgpt = {};

  bot.chatgpt.setConfig = (apiKey, opts) => {
    client = new Client(apiKey, opts);
  };

  bot.chatgpt.sendMessage = async (player, message) => {
    try {
      const reply = await client.chat(memory, player, message);
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
