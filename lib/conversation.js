"use strict";

/**
 * Conversation history for a single player.
 *
 * @class
 */
class Conversation {
  /**
   * Initializes a new Conversation instance.
   *
   * @param {number} [limit=20] - Maximum number of messages to keep.
   */
  constructor(limit) {
    this.messages = [];
    this.limit = limit || 20;
  }

  /**
   * Retrieve the list of messages in the conversation.
   *
   * @returns {Message[]} Conversation messages.
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Add a new message to the conversation.
   *
   * @param {Message} message - Message to append.
   */
  addMessage(message) {
    this.messages.push(message);
    if (this.messages.length > this.limit) {
      this.messages.shift();
    }
  }
}

export { Conversation as default };
