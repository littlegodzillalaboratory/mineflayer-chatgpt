"use strict";

// Conversation class to manage a series of messages forming the communication history
// sent to OpenAI API.
// TODO: Introduce a limit on the number of messages stored in a conversation
// to avoid unintended escalation or players trying to jailbreak the persona.
class Conversation {
  // Initializes a new Conversation instance.
  // This instance will hold a list of messages exchanged in the conversation.
  constructor() {
    this.messages = [];
  }

  // Retrieve the list of messages in the conversation.
  getMessages() {
    return this.messages;
  }

  // Add a new message to the conversation.
  // New messages will be appended to the end of the list.
  // This method is used to register both user messages and assistant replies.
  addMessage(message) {
    this.messages.push(message);
  }
}

export { Conversation as default };
