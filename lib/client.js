"use strict";
import Message from "./message.js";
import { MANDATORY_INSTRUCTIONS_LIST } from "./moderator.js";
import OpenAI from "openai";

const MANDATORY_INSTRUCTIONS = MANDATORY_INSTRUCTIONS_LIST.join("\n");
const COMPLETION_TEMPERATURE = 0;
const COMPLETION_LOGPROBS = true;
const COMPLETION_TOP_LOGPROBS = 3;

// Client class to interact with OpenAI's API
class Client {
  constructor(apiKey, opts) {
    opts = opts || {};

    const baseInstructions =
      opts.instructions ||
      "You are a helpful assistant in a Minecraft world. Answer questions and provide information relevant to the game.";

    this.opts = {
      model: opts.model || "gpt-5.2",
      instructions: `${baseInstructions}\n${MANDATORY_INSTRUCTIONS}`,
    };
    this.openAI = new OpenAI({
      apiKey: apiKey,
    });
  }

  // The chat method sends the player's message to OpenAI API
  // and returns the assistant's reply.
  // The memory parameter is used to manage conversation history for each player,
  // which is included in the messages sent to OpenAI API to provide context for
  // generating replies.
  async chat(memory, player, message) {
    // Construct the messages payload for OpenAI API.
    // It always includes the developer instructions, accompanied by
    // conversation history, and the user message for the current chat.

    const params = {
      model: this.opts.model,
      temperature: COMPLETION_TEMPERATURE,
      logprobs: COMPLETION_LOGPROBS,
      top_logprobs: COMPLETION_TOP_LOGPROBS,
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
      reply = firstChoice.message.content;
      confidenceScore = this._extractConfidenceScore(firstChoice);
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

  _clampConfidenceScore(confidenceScore) {
    return Math.max(0, Math.min(1, confidenceScore));
  }

  _extractConfidenceScore(choice) {
    const messageConfidence = choice?.message?.confidenceScore;
    if (typeof messageConfidence === "number") {
      return this._clampConfidenceScore(messageConfidence);
    }

    const messageConfidenceSnakeCase = choice?.message?.confidence_score;
    if (typeof messageConfidenceSnakeCase === "number") {
      return this._clampConfidenceScore(messageConfidenceSnakeCase);
    }

    const tokenLogProbs = choice?.logprobs?.content;
    if (Array.isArray(tokenLogProbs) && tokenLogProbs.length > 0) {
      const validLogProbs = tokenLogProbs
        .map((item) => item?.logprob)
        .filter((value) => typeof value === "number");
      if (validLogProbs.length > 0) {
        const averageLogProb =
          validLogProbs.reduce((sum, value) => sum + value, 0) /
          validLogProbs.length;
        return this._clampConfidenceScore(Math.exp(averageLogProb));
      }
    }

    return 1;
  }
}

export { Client as default };
