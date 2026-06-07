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
    it("should have default limit 20 when not specified", function () {
      assert.equal(this.conversation.limit, 20);
    });
    it("should add a message to the conversation", function () {
      const message = new Message("user", "Hello", Date.now());
      this.conversation.addMessage(message);
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 1);
      assert.equal(messages[0].getRole(), "user");
      assert.equal(messages[0].getContent(), "Hello");
    });
    it("should add multiple messages in order", function () {
      const userMessage = new Message("user", "Hello", Date.now());
      const assistantMessage = new Message("assistant", "Hi there!", Date.now());
      this.conversation.addMessage(userMessage);
      this.conversation.addMessage(assistantMessage);
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 2);
      assert.equal(messages[0].getRole(), "user");
      assert.equal(messages[1].getRole(), "assistant");
    });
  });

  describe("manage messages with limit", function () {
    beforeEach(function () {
      this.conversation = new Conversation(3);
    });
    it("should have the specified limit", function () {
      assert.equal(this.conversation.limit, 3);
    });
    it("should keep messages when under the limit", function () {
      this.conversation.addMessage(new Message("user", "Message 1", Date.now()));
      this.conversation.addMessage(
        new Message("assistant", "Message 2", Date.now()),
      );
      this.conversation.addMessage(new Message("user", "Message 3", Date.now()));
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 3);
    });
    it("should remove oldest message when exceeding limit", function () {
      this.conversation.addMessage(new Message("user", "Message 1", Date.now()));
      this.conversation.addMessage(
        new Message("assistant", "Message 2", Date.now()),
      );
      this.conversation.addMessage(new Message("user", "Message 3", Date.now()));
      this.conversation.addMessage(
        new Message("assistant", "Message 4", Date.now()),
      );
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 3);
      assert.equal(messages[0].getContent(), "Message 2");
      assert.equal(messages[1].getContent(), "Message 3");
      assert.equal(messages[2].getContent(), "Message 4");
    });
    it("should continue removing oldest messages as new ones are added", function () {
      this.conversation.addMessage(new Message("user", "Message 1", Date.now()));
      this.conversation.addMessage(
        new Message("assistant", "Message 2", Date.now()),
      );
      this.conversation.addMessage(new Message("user", "Message 3", Date.now()));
      this.conversation.addMessage(
        new Message("assistant", "Message 4", Date.now()),
      );
      this.conversation.addMessage(new Message("user", "Message 5", Date.now()));
      const messages = this.conversation.getMessages();
      assert.equal(messages.length, 3);
      assert.equal(messages[0].getContent(), "Message 3");
      assert.equal(messages[1].getContent(), "Message 4");
      assert.equal(messages[2].getContent(), "Message 5");
    });
  });
});
