"use strict";

// Conversation class to manage a series of messages forming the communication history
// sent to OpenAI API.
class Conversation {
  // Initializes a new Conversation instance.
  // This instance will hold a list of messages exchanged in the conversation.
  // The limit parameter limits the number of messages stored, removing the oldest
  // when the limit is exceeded.
  constructor(limit) {
    this.messages = [];
    this.limit = limit || 20;
  }

  // Retrieve the list of messages in the conversation.
  getMessages() {
    return this.messages;
  }

  // Add a new message to the conversation.
  // New messages will be appended to the end of the list.
  // This method is used to register both user messages and assistant replies.
  // If a limit limit is set and exceeded, the oldest message is removed.
  addMessage(message) {
    this.messages.push(message);
    if (this.messages.length > this.limit) {
      this.messages.shift();
    }
  }
}

export { Conversation as default };
