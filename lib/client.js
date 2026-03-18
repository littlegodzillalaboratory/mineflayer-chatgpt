"use strict";
import Message from './message.js';
import OpenAI from 'openai';

// Client class to interact with OpenAI's API
class Client {

  constructor(apiKey, opts) {
    opts = opts || {};
    this.opts = {
      model: opts.model || 'gpt-4o',
      instructions: opts.instructions || 'You are a helpful assistant in a Minecraft world. Answer questions and provide information relevant to the game.'
    };
    this.openAI = new OpenAI({
      apiKey: apiKey
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
      messages: [
        { role: 'developer', content: this.opts.instructions }
      ]
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
      params.messages.push({ role: message.getRole(), content: message.getContent() });
    }
    
    const userMessage = new Message('user', message);
    params.messages.push({ role: userMessage.getRole(), content: userMessage.getContent() });
    
    let reply;

    try {

      const chatCompletion = await this.openAI.chat.completions.create(params);
      reply = chatCompletion.choices[0].message.content;

    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        error = new Error(`An OpenAI error has occurred: ${error.status} ${error.type} ${error.code} ${error.message}`);
      }
      throw error;
    }

    // register the user message and assistant reply in memory
    memory.register(player, userMessage);
    const assistantMessage = new Message('assistant', reply);
    memory.register(player, assistantMessage);
  
    return reply;
  }

}

export {
  Client as default
};