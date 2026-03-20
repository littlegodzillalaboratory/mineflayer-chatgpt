"use strict";
import assert from "assert";
import Conversation from "../lib/conversation.js";
import Message from "../lib/message.js";

describe("conversation", function () {
  describe("manage messages", function () {
    beforeEach(function () {
      this.conversation = new Conversation();
    });
    it("should start with an empty messages list", function () {
      assert.deepEqual(this.conversation.getMessages(), []);
    });
    it("should add a message to the conversation", function () {
      const message = new Message("user", "Hello");
      this.conversation.addMessage(message);
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 1);
      assert.equal(messages[0].getRole(), "user");
      assert.equal(messages[0].getContent(), "Hello");
    });
    it("should add multiple messages in order", function () {
      const userMessage = new Message("user", "Hello");
      const assistantMessage = new Message("assistant", "Hi there!");
      this.conversation.addMessage(userMessage);
      this.conversation.addMessage(assistantMessage);
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 2);
      assert.equal(messages[0].getRole(), "user");
      assert.equal(messages[1].getRole(), "assistant");
    });
  });
});
