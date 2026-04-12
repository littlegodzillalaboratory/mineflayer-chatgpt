"use strict";
import assert from "assert";
import Client from "../lib/client.js";
import mineflayerChatgpt from "../lib/mineflayer-chatgpt.js";
import moderator from "../lib/moderator.js";
import sinon from "sinon";

describe("mineflayer-chatgpt", function () {
  describe("chatgpt", function () {
    beforeEach(function () {
      this.mockClient = sinon.mock(Client.prototype);
      this.mockConsole = sinon.mock(console);

      this.chatCallsCount = 0;
      this.chatLastCallreply = null;
      const self = this;
      this.mockBot = {};
    });
    afterEach(function () {
      this.mockClient.verify();
      this.mockConsole.verify();
      sinon.restore();
    });
    it("should add setConfig function", function () {
      mineflayerChatgpt.chatgpt(this.mockBot);
      assert.equal(typeof this.mockBot.chatgpt.setConfig, "function");
    });
    it("should add sendMessage function", function () {
      mineflayerChatgpt.chatgpt(this.mockBot);
      assert.equal(typeof this.mockBot.chatgpt.sendMessage, "function");
    });
    it("should set config when setConfig is called with opts", function () {
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123", { model: "gpt-5.2", historySize: 20, enableModeration: true });
    });
    it("should set config when setConfig is called without opts", function () {
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123");
    });
    it("should call client chat when sendMessage is called without error", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns("Hi there!");
      const sanitiseStub = sinon.stub(moderator, "sanitiseProfanity").returns("Hi there!");
      const moderateStub = sinon.stub(moderator, "moderateMessage").resolves({
        flagged: false,
        categories: {},
        category_scores: {},
        message: "Hi there!",
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123");
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
      assert.equal(sanitiseStub.calledOnce, true);
      assert.equal(moderateStub.calledOnce, true);
    });
    it("should log error message when it is a generic error", async function () {
      this.mockConsole
        .expects("error")
        .once()
        .withExactArgs("An unexpected error has occurred: some error");
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .throws(new Error("some error"));
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123");
      try {
        await this.mockBot.chatgpt.sendMessage("someplayer", "Hello");
        assert.fail("Expected an error to be thrown");
      } catch (err) {
        assert.equal(err.message, "some error");
      }
    });
    it("should log error message when OpenAI error is rethrown by client", async function () {
      this.mockConsole
        .expects("error")
        .once()
        .withExactArgs(
          "An unexpected error has occurred: An OpenAI error has occurred: 400 errtype errcode some openai error",
        );
      const wrappedError = new Error(
        "An OpenAI error has occurred: 400 errtype errcode some openai error",
      );
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .throws(wrappedError);
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123");
      try {
        await this.mockBot.chatgpt.sendMessage("someplayer", "Hello");
        assert.fail("Expected an error to be thrown");
      } catch (err) {
        assert.equal(
          err.message,
          "An OpenAI error has occurred: 400 errtype errcode some openai error",
        );
      }
    });
    it("should log reply when enableLogging is true", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns("Hi there!");
      this.mockConsole
        .expects("log")
        .once()
        .withExactArgs("Player someplayer received a reply from ChatGPT: Hi there!");
      sinon.stub(moderator, "sanitiseProfanity").returns("Hi there!");
      sinon.stub(moderator, "moderateMessage").resolves({
        flagged: false,
        categories: {},
        category_scores: {},
        message: "Hi there!",
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123", { enableLogging: true });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
    });
    it("should not log reply when enableLogging is false", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns("Hi there!");
      this.mockConsole
        .expects("log")
        .never();
      sinon.stub(moderator, "sanitiseProfanity").returns("Hi there!");
      sinon.stub(moderator, "moderateMessage").resolves({
        flagged: false,
        categories: {},
        category_scores: {},
        message: "Hi there!",
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig("sk-123", { enableLogging: false });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
    });
  });
});
