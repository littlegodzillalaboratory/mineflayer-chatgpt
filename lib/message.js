"use strict";

/**
 * Message payload sent to OpenAI API.
 * A message consists of a role, content, and timestamp.
 *
 * @class
 */
class Message {
  /**
   * Initializes a new Message instance.
   *
   * @param {string} role - Message role such as `user`, `assistant`, or `developer`.
   * @param {string} content - Message content.
   * @param {number} [timestamp=Date.now()] - Unix timestamp in milliseconds.
   */
  constructor(role, content, timestamp = Date.now()) {
    this.role = role;
    this.content = content;
    this.timestamp = timestamp;
  }

  /**
   * Retrieve the role of the message.
   *
   * @returns {string} Message role.
   */
  getRole() {
    return this.role;
  }

  /**
   * Retrieve the content of the message.
   *
   * @returns {string} Message content.
   */
  getContent() {
    return this.content;
  }

  /**
   * Retrieve the timestamp of the message.
   *
   * @returns {number} Unix timestamp in milliseconds.
   */
  getTimestamp() {
    return this.timestamp;
  }
}

export { Message as default };
