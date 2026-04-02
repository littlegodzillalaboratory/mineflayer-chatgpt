"use strict";
import assert from "assert";
import sinon from "sinon";
import Memory from "../lib/memory.js";
import Message from "../lib/message.js";

describe("memory", function () {
  describe("manage player conversations", function () {
    beforeEach(function () {
      this.memory = new Memory();
      this.memory.initialize("someplayer");
      const message = new Message("user", "Hello");
      this.memory.register("someplayer", message);
    });
    it("should have default 20 historySize when not specified", function () {
      assert.equal(this.memory.historySize, 20);
    });
    it("should return true when checking for an existing player", function () {
      assert.equal(this.memory.exists("someplayer"), true);
    });
    it("should return false when checking for an inexisting player", function () {
      assert.equal(this.memory.exists("inexistingplayer"), false);
    });
    it("should retrieve conversation for an existing player", function () {
      const conversation = this.memory.retrieve("someplayer");
      assert.notEqual(conversation, undefined);
      const messages = conversation.getMessages();
      assert.equal(messages.length, 1);
      assert.equal(messages[0].getRole(), "user");
      assert.equal(messages[0].getContent(), "Hello");
    });
    it("should initialize a new conversation for a new player on retrieve", function () {
      const conversation = this.memory.retrieve("newplayer");
      assert.notEqual(conversation, undefined);
      assert.deepEqual(conversation.getMessages(), []);
    });
    it("should log when initializing conversation for an existing player", function () {
      const consoleStub = sinon.stub(console, "info");
      this.memory.initialize("someplayer");
      assert(consoleStub.calledOnce);
      assert(
        consoleStub.calledWith(
          "Memory for player someplayer already exists. Nothing to initialize.",
        ),
      );
      consoleStub.restore();
    });
    it("should register multiple messages in a conversation", function () {
      const reply = new Message("assistant", "Hi there!");
      this.memory.register("someplayer", reply);
      const messages = this.memory.retrieve("someplayer").getMessages();
      assert.equal(messages.length, 2);
      assert.equal(messages[0].getContent(), "Hello");
      assert.equal(messages[1].getContent(), "Hi there!");
    });
  });

  describe("manage player conversations with size limit", function () {
    beforeEach(function () {
      this.memory = new Memory(3);
      this.memory.initialize("someplayer");
    });
    it("should have the specified historySize", function () {
      assert.equal(this.memory.historySize, 3);
    });
    it("should pass size to new conversations", function () {
      const conversation = this.memory.retrieve("someplayer");
      assert.equal(conversation.limit, 3);
    });
    it("should pass size to conversations created via retrieve", function () {
      const conversation = this.memory.retrieve("newplayer");
      assert.equal(conversation.limit, 3);
    });
    it("should enforce size limit when registering messages", function () {
      this.memory.register("someplayer", new Message("user", "Message 1"));
      this.memory.register("someplayer", new Message("assistant", "Message 2"));
      this.memory.register("someplayer", new Message("user", "Message 3"));
      this.memory.register("someplayer", new Message("assistant", "Message 4"));
      const messages = this.memory.retrieve("someplayer").getMessages();
      assert.equal(messages.length, 3);
      assert.equal(messages[0].getContent(), "Message 2");
      assert.equal(messages[1].getContent(), "Message 3");
      assert.equal(messages[2].getContent(), "Message 4");
    });
    it("should enforce size limit per player independently", function () {
      this.memory.register("someplayer", new Message("user", "Player1 Msg1"));
      this.memory.register("someplayer", new Message("assistant", "Player1 Msg2"));
      this.memory.register("someplayer", new Message("user", "Player1 Msg3"));
      this.memory.register("someplayer", new Message("assistant", "Player1 Msg4"));
      this.memory.initialize("anotherplayer");
      this.memory.register("anotherplayer", new Message("user", "Player2 Msg1"));
      this.memory.register("anotherplayer", new Message("assistant", "Player2 Msg2"));
      const player1Messages = this.memory.retrieve("someplayer").getMessages();
      const player2Messages = this.memory.retrieve("anotherplayer").getMessages();
      assert.equal(player1Messages.length, 3);
      assert.equal(player2Messages.length, 2);
      assert.equal(player1Messages[0].getContent(), "Player1 Msg2");
      assert.equal(player2Messages[0].getContent(), "Player2 Msg1");
    });
  });
});
