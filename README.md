![Avatar](avatar.jpg)

[![Build Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CI/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACI)
[![Dependencies Status](https://img.shields.io/librariesio/release/npm/mineflayer-chatgpt)](https://libraries.io/npm/mineflayer-chatgpt)
[![Code Scanning Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CodeQL/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACodeQL)
[![Coverage Status](https://coveralls.io/repos/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg?branch=main)](https://coveralls.io/r/littlegodzillalaboratory/mineflayer-chatgpt?branch=main)
[![Security Status](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg)](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt)
[![Published Version](https://img.shields.io/npm/v/mineflayer-chatgpt.svg)](https://www.npmjs.com/package/mineflayer-chatgpt)

# Mineflayer ChatGPT

Mineflayer ChatGPT is a [Mineflayer](https://github.com/PrismarineJS/mineflayer) plugin for sending messages to OpenAI's [ChatGPT](https://chat.openai.com/).

## Installation

    npm install mineflayer-chatgpt

or as a dependency in package.json file:

    "dependencies": {
      "mineflayer-chatgpt": "x.y.z"
    }

## Usage

Load the plugin:

    import mineflayerChatgpt from 'mineflayer-chatgpt';

    ...

    bot.loadPlugin(mineflayerChatgpt.chatgpt);

Set the configuration:

    const chatGptApiKey = 'sk-1234567890abcdef';
    bot.chatgpt.setConfig(chatGptApiKey, {
      model: 'gpt-5.2',
      historySize: 20,
      enableModeration: true,
      coolDownInSeconds: 15,
      minimumConfidenceScore: 0.9,
      enableMessageLogging: true
    });

Send a message to ChatGPT:

    bot.chatgpt.sendMessage('player', 'How to craft a diamond sword in Minecraft?');

## Configuration

| Property | Type | Required | Default | Description | Example |
|----------|------|----------|---------|-------------|---------|
| model | string | No | gpt-5.2 | Chat completion model name. | gpt-4.1-mini |
| instructions | string | No | You are a helpful assistant in a Minecraft world. Answer questions and provide information relevant to the game. | Base developer instructions prepended to every conversation. Mandatory safety instructions are always appended internally. | You are a concise Minecraft redstone expert. |
| historySize | number | No | 20 | Maximum number of messages kept per-player in memory. | 50 |
| enableModeration | boolean | No | true | Enables outbound and inbound moderation checks. | false |
| coolDownInSeconds | number | No | 15 | Minimum seconds required between a player's latest prior message and the next outbound message. | 30 |
| minimumConfidenceScore | number | No | 0.9 | Minimum accepted reply confidence score. Replies below this threshold are replaced by fallbackMessage. | 0.8 |
| enableMessageLogging | boolean | No | false | Logs model replies to console output. | true |
| fallbackMessage | string | No | Sorry, I cannot provide a response to that message. | Response returned when moderation, cooldown, or confidence checks fail. | Please wait a moment before sending another message. |


## Colophon

[Developer's Guide](https://littlegodzillalaboratory.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/complexity/plato/index.html)
* [Unit tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test/mocha.txt)
* [Test coverage report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/coverage/c8/index.html)
* [Integration tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test-integration/cmdt.txt)
* [API Documentation](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/doc/jsdoc/index.html)