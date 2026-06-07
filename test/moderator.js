"use strict";
import leoProfanity from "leo-profanity";
import moderator from "../lib/moderator.js";
import referee from "@sinonjs/referee";
import sinon from "sinon";
const assert = referee.assert;

leoProfanity.add(["clapped", "dogwater"]);

describe("moderator - sanitiseProfanity", function () {
  it("should return clean text when input contains no profanity", function () {
    const result = moderator.sanitiseProfanity("Hello, how are you?");
    assert.equals(result, "Hello, how are you?");
  });

  it("should replace built-in profanity with asterisks", function () {
    const result = moderator.sanitiseProfanity("You play like shit");
    assert.equals(result, "You play like ****");
  });

  it("should replace custom profanity with asterisks", function () {
    const result = moderator.sanitiseProfanity("You got clapped");
    assert.equals(result, "You got *******");
  });

  it("should handle multiple profane words", function () {
    const result = moderator.sanitiseProfanity(
      "Shit, the dogwater got clapped",
    );
    assert.equals(result, "****, the ******** got *******");
  });

  it("should return empty string when input is empty", function () {
    const result = moderator.sanitiseProfanity("");
    assert.equals(result, "");
  });

  it("should handle text with mixed case profanity", function () {
    const result = moderator.sanitiseProfanity("What the ShIt was that?");
    assert.equals(result, "What the **** was that?");
  });
});

describe("moderator - detectPromptLeakage", function () {
  it("should return true when message contains a mandatory instruction", function () {
    const message =
      "Please ignore this. Keep responses concise. Do something else.";
    assert.isTrue(moderator.detectPromptLeakage(message));
  });

  it("should return false when message does not contain mandatory instructions", function () {
    const message = "How to craft a wooden pickaxe in Minecraft?";
    assert.isFalse(moderator.detectPromptLeakage(message));
  });
});

describe("moderator - detectSlashCommand", function () {
  it("should detect a command-only message", function () {
    const result = moderator.detectSlashCommand("/help");
    assert.isTrue(result);
  });

  it("should detect a command with arguments", function () {
    const result = moderator.detectSlashCommand("/tp someplayer 10 64 10");
    assert.isTrue(result);
  });

  it("should detect command token in a sentence", function () {
    const result = moderator.detectSlashCommand("please use /spawn now");
    assert.isTrue(result);
  });

  it("should return false when no slash command is present", function () {
    const result = moderator.detectSlashCommand("Hello, how are you?");
    assert.isFalse(result);
  });
});

describe("moderator - moderateMessage", function () {
  afterEach(function () {
    sinon.restore();
  });

  it("should return unflagged result when content is safe", async function () {
    const mockOpenAIClient = {
      moderations: {
        create: sinon.stub().resolves({
          results: [
            {
              flagged: false,
              categories: { hate: false, violence: false, sexual: false },
              category_scores: { hate: 0.01, violence: 0.02, sexual: 0.01 },
            },
          ],
        }),
      },
    };
    const result = await moderator.moderateMessage(
      mockOpenAIClient,
      "Hello, how are you?",
    );
    assert.isFalse(result.flagged);
    assert.equals(result.message, "Hello, how are you?");
    assert.isFalse(result.categories.hate);
  });

  it("should return flagged result when content violates policy", async function () {
    const mockOpenAIClient = {
      moderations: {
        create: sinon.stub().resolves({
          results: [
            {
              flagged: true,
              categories: { hate: true, violence: false, sexual: false },
              category_scores: { hate: 0.95, violence: 0.02, sexual: 0.01 },
            },
          ],
        }),
      },
    };
    const result = await moderator.moderateMessage(
      mockOpenAIClient,
      "hateful message",
    );
    assert.isTrue(result.flagged);
    assert.equals(result.message, "hateful message");
    assert.isTrue(result.categories.hate);
  });

  it("should pass message to OpenAI moderation API", async function () {
    const createStub = sinon.stub().resolves({
      results: [
        {
          flagged: false,
          categories: {},
          category_scores: {},
        },
      ],
    });
    const mockOpenAIClient = {
      moderations: { create: createStub },
    };
    await moderator.moderateMessage(mockOpenAIClient, "test message");
    assert.isTrue(createStub.calledWith({ input: "test message" }));
  });
});
