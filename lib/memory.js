"use strict";

import Conversation from "./conversation.js";

// Memory class to manage conversations for different players.
// Because a single Mineflayer bot can interact with multiple players,
// a conversation with each player has its own history and context.
// TODO: Consider adding configurable memory expiration.
// E.g. if a player hasn't interacted for a while, their memory could be cleared.
// This could be implemented with a timestamp for each conversation.
class Memory {
  constructor() {
    this.conversations = {};
  }

  // Check if there's any memory of a conversation with a specific player.
  // Returns true if the player exists in memory, false otherwise.
  // This is useful for checking if a player has an ongoing conversation.
  exists(player) {
    return player in this.conversations;
  }

  // Initialize a conversation with a specific player.
  // If the player already exists, it does nothing and logs a warning.
  initialize(player) {
    if (!this.exists(player)) {
      this.conversations[player] = new Conversation();
    } else {
      console.warn(
        `Memory for player ${player} already exists. Nothing to initialize.`,
      );
    }
  }

  // Retrieve the conversation history for a specific player.
  // If the player does not exist in memory, it initializes a new conversation.
  // This ensures that the conversation can be used immediately without checking existence.
  retrieve(player) {
    if (!this.exists(player)) {
      this.initialize(player);
    }
    return this.conversations[player];
  }

  // Register a new message in the conversation for a specific player.
  // This method adds a message to the player's conversation history.
  register(player, message) {
    this.conversations[player].addMessage(message);
  }
}

export { Memory as default };
