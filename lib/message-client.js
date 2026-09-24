"use strict";
import Message from "./message.js";
import { SECURITY_INSTRUCTIONS_LIST } from "./moderator.js";
import OpenAI from "openai";

const SECURITY_INSTRUCTIONS = SECURITY_INSTRUCTIONS_LIST.join("\n");
const REPLY_RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "reply_with_confidence",
    strict: true,
    schema: {
      type: "object",
      properties: {
        reply: {
          type: "string",
          description: "The reply to send to the player.",
        },
        confidenceScore: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description:
            "The model's confidence that its reply correctly answers the player's message, from 0 (no confidence) to 1 (highest confidence).",
        },
      },
      required: ["reply", "confidenceScore"],
      additionalProperties: false,
    },
  },
};

/**
 * Chat completion client wrapper.
 *
 * Builds the conversation payload, sends it to an OpenAI-compatible chat
 * completion endpoint, and returns the reply with a self-reported confidence
 * score. Pointing `opts.baseURL` at a local server (e.g. a vMLX OpenAI-compatible
 * endpoint) allows a local LLM to be used instead of OpenAI.
 *
 * @class
 */
class MessageClient {
  /**
   * Initializes a new message client.
   *
   * @param {string} messageApiKey - API key for the chat completion endpoint. Any placeholder value works for local LLM servers that don't require authentication.
   * @param {object} [opts={}] - Client options.
   * @param {string} [opts.model='gpt-5.6'] - Chat completion model.
   * @param {string} [opts.instructions] - Base developer instructions.
   * @param {boolean} [opts.enableSecurityInstructions=true] - Append security instructions to the base instructions.
   * @param {string} [opts.baseURL] - Base URL of the chat completion endpoint. Set this to use a local OpenAI-compatible LLM server (e.g. vMLX) instead of OpenAI.
   */
  constructor(messageApiKey, opts) {
    opts = opts || {};

    const baseInstructions =
      opts.instructions ||
      "You are a helpful assistant in a Minecraft world. Answer questions and provide information relevant to the game.";

    const enableSecurityInstructions = opts.enableSecurityInstructions ?? true;

    // Available models: https://developers.openai.com/api/docs/models
    this.opts = {
      model: opts.model || "gpt-5.6",
      instructions: enableSecurityInstructions
        ? `${baseInstructions}\n${SECURITY_INSTRUCTIONS}`
        : baseInstructions,
    };
    this.openAI = new OpenAI({
      apiKey: messageApiKey,
      baseURL: opts.baseURL,
    });
  }

  /**
   * Send a message to the chat completion endpoint and return the generated reply.
   *
   * @param {Memory} memory - Per-player conversation memory.
   * @param {string} player - Player name or id.
   * @param {string} message - Player message.
   * @returns {Promise<{reply: string, confidenceScore: number}>} Reply and confidence score.
   */
  async chat(memory, player, message) {
    const params = {
      model: this.opts.model,
      response_format: REPLY_RESPONSE_FORMAT,
      messages: [{ role: "developer", content: this.opts.instructions }],
    };

    let conversation;
    if (memory.exists(player)) {
      // If there's prior conversation for the player,
      // the conversation history will be included in the messages
      // sent to OpenAI API in order to provide context
      conversation = memory.retrieve(player);
    } else {
      // If there's no prior conversation for the player,
      // then initialize a new conversation
      memory.initialize(player);
      conversation = memory.retrieve(player);
    }
    for (const message of conversation.getMessages()) {
      params.messages.push({
        role: message.getRole(),
        content: message.getContent(),
      });
    }

    const userMessage = new Message("user", message, Date.now());
    params.messages.push({
      role: userMessage.getRole(),
      content: userMessage.getContent(),
    });

    let reply;
    let confidenceScore;

    try {
      const chatCompletion = await this.openAI.chat.completions.create(params);
      const firstChoice = chatCompletion.choices[0];
      const structuredReply = this._parseStructuredReply(firstChoice?.message);
      reply = structuredReply.reply;
      confidenceScore = structuredReply.confidenceScore;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        error = new Error(
          `An OpenAI error has occurred: ${error.status} ${error.type} ${error.code} ${error.message}`,
        );
      }
      throw error;
    }

    // register the user message and assistant reply in memory
    memory.register(player, userMessage);
    const assistantMessage = new Message("assistant", reply, Date.now());
    memory.register(player, assistantMessage);

    return {
      reply: reply,
      confidenceScore: confidenceScore,
    };
  }

  /**
   * Parse and validate a structured reply returned by the model.
   *
   * The API enforces the JSON schema for supported models. Validation here
   * keeps failures explicit when an OpenAI-compatible endpoint does not.
   *
   * @param {object} message - OpenAI completion message.
   * @returns {{reply: string, confidenceScore: number}} Structured reply.
   */
  _parseStructuredReply(message) {
    if (typeof message?.refusal === "string" && message.refusal.length > 0) {
      throw new Error(`The model refused to reply: ${message.refusal}`);
    }

    let structuredReply;
    try {
      structuredReply = JSON.parse(message?.content);
    } catch (error) {
      throw new Error("The model returned an invalid structured reply", {
        cause: error,
      });
    }

    if (
      typeof structuredReply?.reply !== "string" ||
      typeof structuredReply?.confidenceScore !== "number" ||
      !Number.isFinite(structuredReply.confidenceScore) ||
      structuredReply.confidenceScore < 0 ||
      structuredReply.confidenceScore > 1
    ) {
      throw new Error("The model returned an invalid structured reply");
    }

    return structuredReply;
  }
}

export { MessageClient as default };
