"use strict";

import Conversation from "./conversation.js";

/**
 * Per-player conversation memory.
 *
 * Each player gets their own conversation history so context does not leak
 * between players.
 *
 * @class
 */
class Memory {
  /**
   * Initializes a new Memory instance.
   *
   * @param {number} [historySize=20] - Maximum messages stored per player.
   */
  constructor(historySize) {
    this.conversations = {};
    this.historySize = historySize || 20;
  }

  /**
   * Check if a conversation exists for a player.
   *
   * @param {string} player - Player name or id.
   * @returns {boolean} True when the player exists in memory.
   */
  exists(player) {
    return player in this.conversations;
  }

  /**
   * Initialize a conversation for a player.
   *
   * @param {string} player - Player name or id.
   */
  initialize(player) {
    if (!this.exists(player)) {
      this.conversations[player] = new Conversation(this.historySize);
    } else {
      console.info(
        `Memory for player ${player} already exists. Nothing to initialize.`,
      );
    }
  }

  /**
   * Retrieve the conversation for a player, creating it if needed.
   *
   * @param {string} player - Player name or id.
   * @returns {Conversation} Player conversation.
   */
  retrieve(player) {
    if (!this.exists(player)) {
      this.initialize(player);
    }
    return this.conversations[player];
  }

  /**
   * Register a new message for a player.
   *
   * @param {string} player - Player name or id.
   * @param {Message} message - Message to register.
   */
  register(player, message) {
    this.conversations[player].addMessage(message);
  }
}

export { Memory as default };
