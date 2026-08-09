"use strict";
import assert from "assert";
import MessageClient from "../lib/message-client.js";
import mineflayerChatgpt from "../lib/mineflayer-chatgpt.js";
import moderator from "../lib/moderator.js";
import sinon from "sinon";

describe("mineflayer-chatgpt", function () {
  describe("chatgpt", function () {
    beforeEach(function () {
      this.mockClient = sinon.mock(MessageClient.prototype);
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
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        model: "gpt-5.6",
        historySize: 20,
        enableModeration: true,
      });
    });
    it("should set config when setConfig is called without opts", function () {
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
      });
    });
    it("should call client chat when sendMessage is called without error", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.99,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Hi there!",
          flagged: false,
        });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
      assert.equal(
        moderateOutboundStub.calledWith(
          sinon.match.any,
          sinon.match.any,
          "someplayer",
          "Hello",
          "Sorry, I cannot provide a response to that message.",
          15,
        ),
        true,
      );
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
      sinon.stub(moderator, "moderateOutboundMessage").resolves({
        message: "Hello",
        flagged: false,
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
      });
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
      sinon.stub(moderator, "moderateOutboundMessage").resolves({
        message: "Hello",
        flagged: false,
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
      });
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
    it("should log reply when enableMessageLogging is true", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.99,
        });
      this.mockConsole
        .expects("log")
        .once()
        .withExactArgs(
          "Player someplayer received a reply from ChatGPT: Hi there!",
        );
      sinon.stub(moderator, "moderateOutboundMessage").resolves({
        message: "Hello",
        flagged: false,
      });
      sinon.stub(moderator, "moderateInboundReply").resolves({
        reply: "Hi there!",
        flagged: false,
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        enableMessageLogging: true,
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
    });
    it("should not log reply when enableMessageLogging is false", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.99,
        });
      this.mockConsole.expects("log").never();
      sinon.stub(moderator, "moderateOutboundMessage").resolves({
        message: "Hello",
        flagged: false,
      });
      sinon.stub(moderator, "moderateInboundReply").resolves({
        reply: "Hi there!",
        flagged: false,
      });
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        enableMessageLogging: false,
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
    });
    it("should return custom fallback message when moderation flags reply", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Some flagged content",
          confidenceScore: 0.99,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Custom fallback message",
          flagged: true,
        });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        fallbackMessage: "Custom fallback message",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Custom fallback message");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
    });
    it("should return custom fallback message when moderation flags message", async function () {
      this.mockClient.expects("chat").never();
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Custom fallback message",
          flagged: true,
        });
      const moderateInboundStub = sinon.stub(moderator, "moderateInboundReply");
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        fallbackMessage: "Custom fallback message",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Custom fallback message");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.notCalled, true);
    });

    it("should return custom fallback message when reply contains slash command", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Use /kill @e",
          confidenceScore: 0.99,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Custom fallback message",
          flagged: true,
        });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        fallbackMessage: "Custom fallback message",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Custom fallback message");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
    });

    it("should return custom fallback message when reply contains prompt leakage", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Keep responses concise.",
          confidenceScore: 0.99,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Custom fallback message",
          flagged: true,
        });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        fallbackMessage: "Custom fallback message",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Custom fallback message");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
    });

    it("should return fallback message when reply confidence score is below minimum", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.4,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Sorry, I cannot provide a response to that message.",
          flagged: true,
        });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(
        reply,
        "Sorry, I cannot provide a response to that message.",
      );
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
      assert.equal(
        moderateInboundStub.calledWith(
          sinon.match.any,
          "Hi there!",
          "Sorry, I cannot provide a response to that message.",
          0.4,
          0.9,
        ),
        true,
      );
    });

    it("should use custom minimumConfidenceScore when provided", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.85,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      const moderateInboundStub = sinon
        .stub(moderator, "moderateInboundReply")
        .resolves({
          reply: "Hi there!",
          flagged: false,
        });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        minimumConfidenceScore: 0.8,
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
      assert.equal(moderateOutboundStub.calledOnce, true);
      assert.equal(moderateInboundStub.calledOnce, true);
      assert.equal(
        moderateInboundStub.calledWith(
          sinon.match.any,
          "Hi there!",
          sinon.match.string,
          0.85,
          0.8,
        ),
        true,
      );
    });

    it("should use custom coolDownInSeconds when provided", async function () {
      this.mockClient
        .expects("chat")
        .once()
        .withArgs(sinon.match.any, "someplayer", "Hello")
        .returns({
          reply: "Hi there!",
          confidenceScore: 0.99,
        });
      const moderateOutboundStub = sinon
        .stub(moderator, "moderateOutboundMessage")
        .resolves({
          message: "Hello",
          flagged: false,
        });
      sinon.stub(moderator, "moderateInboundReply").resolves({
        reply: "Hi there!",
        flagged: false,
      });
      this.mockConsole.expects("warn").never();
      mineflayerChatgpt.chatgpt(this.mockBot);
      this.mockBot.chatgpt.setConfig({
        messageApiKey: "sk-123",
        moderationApiKey: "sk-456",
        coolDownInSeconds: 30,
      });
      const reply = await this.mockBot.chatgpt.sendMessage(
        "someplayer",
        "Hello",
      );
      assert.equal(reply, "Hi there!");
      assert.equal(
        moderateOutboundStub.calledWith(
          sinon.match.any,
          sinon.match.any,
          "someplayer",
          "Hello",
          "Sorry, I cannot provide a response to that message.",
          30,
        ),
        true,
      );
    });
  });
});
