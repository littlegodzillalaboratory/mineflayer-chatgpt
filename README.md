<img align="right" src="https://raw.github.com/littlegodzillalaboratory/mineflayer-chatgpt/main/avatar.jpg" alt="Avatar"/>

[![Build Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CI/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACI)
[![Dependencies Status](https://img.shields.io/librariesio/release/npm/mineflayer-chatgpt)](https://libraries.io/npm/mineflayer-chatgpt)
[![Code Scanning Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CodeQL/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACodeQL)
[![Coverage Status](https://coveralls.io/repos/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg?branch=main)](https://coveralls.io/r/littlegodzillalaboratory/mineflayer-chatgpt?branch=main)
[![Security Status](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg)](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt)
[![Published Version](https://img.shields.io/npm/v/mineflayer-chatgpt.svg)](https://www.npmjs.com/package/mineflayer-chatgpt)
<br/>

Mineflayer ChatGPT
------------------

Mineflayer ChatGPT is a [Mineflayer](https://github.com/PrismarineJS/mineflayer) plugin for sending messages to OpenAI's [ChatGPT](https://chat.openai.com/).

Installation
------------

    npm install mineflayer-chatgpt

or as a dependency in package.json file:

    "dependencies": {
      "mineflayer-chatgpt": "x.y.z"
    }

Usage
-----

Load the plugin:

    import mineflayerChatgpt from 'mineflayer-chatgpt';

    ...

    bot.loadPlugin(mineflayerChatgpt.chatgpt);

Set the configuration:

    const chatGptApiKey = 'sk-1234567890abcdef';
    bot.chatgpt.setConfig(chatGptApiKey, {
      model: 'gpt-3.5-turbo'
    });

Send a message to ChatGPT:

    bot.chatgpt.sendMessage('player', 'How to craft a diamond sword in Minecraft?');

Colophon
--------

[Developer's Guide](https://littlegodzillalaboratory.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/complexity/plato/index.html)
* [Unit tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test/mocha.txt)
* [Test coverage report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/coverage/c8/index.html)
* [Integration tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test-integration/cmdt.txt)
* [API Documentation](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/doc/jsdoc/index.html)