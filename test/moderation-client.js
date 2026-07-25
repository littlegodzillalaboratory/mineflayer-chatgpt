"use strict";
import assert from "assert";
import ModerationClient from "../lib/moderation-client.js";
import OpenAI from "openai";
import sinon from "sinon";

describe("moderation-client", function () {
  beforeEach(function () {
    this.client = new ModerationClient("sk-test-key");
  });

  it("should moderate content through OpenAI moderation API", async function () {
    this.client.openAI = {
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

    const result = await this.client.moderate("Hello, how are you?");
    assert.equal(result.flagged, false);
    assert.equal(result.message, "Hello, how are you?");
    assert.equal(result.categories.hate, false);
  });

  it("should wrap OpenAI.APIError from moderation API and rethrow as a regular Error", async function () {
    this.client.openAI = {
      moderations: {
        create: sinon.stub().rejects(
          new OpenAI.APIError(
            401,
            {
              type: "invalid_request_error",
              code: "invalid_api_key",
              message: "Incorrect API key provided",
            },
            "Incorrect API key provided",
            { get: () => undefined },
          ),
        ),
      },
    };

    try {
      await this.client.moderate("test message");
      assert.fail("Expected an error to be thrown");
    } catch (error) {
      assert.ok(!(error instanceof OpenAI.APIError));
      assert.ok(error.message.includes("An OpenAI error has occurred"));
      assert.ok(error.message.includes("invalid_api_key"));
    }
  });
});
