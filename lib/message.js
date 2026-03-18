"use strict";

// Message class to encapsulate a message payload to be sent to OpenAI API.
// A message consists of a role and content.
class Message {

  // Initializes a new Message instance with a role and content.
  // The role can be 'user', 'assistant', or 'developer'.
  // The content is the actual message string.
  constructor(role, content) {
    this.role = role;
    this.content = content;
  }

  // Retrieve the role of the message.
  getRole() {
    return this.role;
  }

  // Retrieve the content of the message.
  getContent() {
    return this.content;
  }
}

export {
  Message as default
};