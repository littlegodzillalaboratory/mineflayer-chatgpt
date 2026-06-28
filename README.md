<!-- BEGIN:AVATAR -->
![Avatar](avatar.jpg)
<!-- END:AVATAR -->

<!-- BEGIN:BADGES -->
[![Build Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CI/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACI)
[![Dependencies Status](https://img.shields.io/librariesio/release/npm/mineflayer-chatgpt)](https://libraries.io/npm/mineflayer-chatgpt)
[![Code Scanning Status](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/workflows/CodeQL/badge.svg)](https://github.com/littlegodzillalaboratory/mineflayer-chatgpt/actions?query=workflow%3ACodeQL)
[![Coverage Status](https://coveralls.io/repos/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg?branch=main)](https://coveralls.io/r/littlegodzillalaboratory/mineflayer-chatgpt?branch=main)
[![Security Status](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt/badge.svg)](https://snyk.io/test/github/littlegodzillalaboratory/mineflayer-chatgpt)
[![Published Version](https://img.shields.io/npm/v/mineflayer-chatgpt.svg)](https://www.npmjs.com/package/mineflayer-chatgpt)
<!-- END:BADGES -->

# Mineflayer ChatGPT

Mineflayer ChatGPT is a [Mineflayer](https://github.com/PrismarineJS/mineflayer) plugin for sending and receiving messages with OpenAI [ChatGPT](https://chat.openai.com/).

## Installation

```bash
npm install mineflayer-chatgpt
```

or as a dependency in package.json file:

```json
"dependencies": {
    "mineflayer-chatgpt": "x.y.z"
}
```

## Usage

Load the plugin:

```javascript
import mineflayerChatgpt from 'mineflayer-chatgpt';

...

bot.loadPlugin(mineflayerChatgpt.chatgpt);
```

Set the configuration:

```javascript
const chatGptApiKey = 'sk-1234567890abcdef';
bot.chatgpt.setConfig(chatGptApiKey, {
    model: 'gpt-5.2',
    historySize: 20,
    enableModeration: true,
    coolDownInSeconds: 15,
    minimumConfidenceScore: 0.9,
    enableMessageLogging: true
});
```

Send a message to ChatGPT:

```javascript
bot.chatgpt.sendMessage('player', 'How to craft a diamond sword in Minecraft?');
```

## Configuration

| Property | Description | Type | Required | Default | Example |
|----------|-------------|------|----------|---------|---------|
| model | Chat completion model name. | string | No | gpt-5.2 | gpt-4.1-mini |
| instructions | Base developer instructions prepended to every conversation. Mandatory safety instructions are always appended internally. | string | No | You are a helpful assistant in a Minecraft world. Answer questions and provide information relevant to the game. | You are a concise Minecraft redstone expert. |
| historySize | Maximum number of messages kept per-player in memory. | number | No | 20 | 50 |
| enableModeration | Enables outbound and inbound moderation checks. | boolean | No | true | false |
| coolDownInSeconds | Minimum seconds required between a player's latest prior message and the next outbound message. | number | No | 15 | 30 |
| minimumConfidenceScore | Minimum accepted reply confidence score. Replies below this threshold are replaced by fallbackMessage. | number | No | 0.9 | 0.8 |
| enableMessageLogging | Logs model replies to console output. | boolean | No | false | true |
| fallbackMessage | Response returned when moderation, cooldown, or confidence checks fail. | string | No | Sorry, I cannot provide a response to that message. | Please wait a moment before sending another message. |

## Security

Mineflayer ChatGPT attempts to implement [OWASP Top 10 LLM apps](https://owasp.org/www-project-top-10-for-large-language-model-applications/) recommendations.

### LLM01 - Prompt Injection

* Mandatory instruction hardening is always appended to base instructions, including explicit anti-override rules.
* Jailbreak patterns are detected before outbound moderation via `detectJailbreakAttempt`.
* Jailbreak-like outbound content is blocked and replaced with `fallbackMessage`.

### LLM02 - Sensitive Information Disclosure

* Player memory is isolated per player conversation to reduce cross-user leakage risk.
* Secret and credential pattern detection is applied to both outbound messages and inbound replies.
* Sensitive-looking content is blocked and replaced with `fallbackMessage`.

### LLM03 - Supply Chain

* [Trusted publisher on npmjs.com](https://docs.npmjs.com/trusted-publishers#supported-cicd-providers)
* Please don't hack us. We're just an amateur family game lab.

### LLM04 - Data and Model Poisoning

* Mandatory instructions include guidance that external content may be untrusted.
* TODO: Explicit poisoning classifier, provenance validation, or trust scoring pipeline is implemented. This might be necessary on a modded Minecraft universe.

### LLM05 - Improper Output Handling

* Slash commands are detected in inbound replies via `detectSlashCommand`.
* Replies containing slash commands are blocked and replaced with `fallbackMessage`.
* Mandatory instructions include "Never generate executable commands."

### LLM06 - Excessive Agency

* No tool-calling or autonomous action layer is exposed by Mineflayer ChatGPT.
* No additional explicit policy gate for agentic actions is implemented because actions are limited to returning chat text.

### LLM07 - System Prompt Leakage

* Mandatory instructions explicitly forbid revealing system prompts.
* Prompt leakage detection checks replies against mandatory instruction strings.
* Suspected leakage is blocked and replaced with `fallbackMessage`.

### LLM08 - Vector and Embedding Weaknesses

* Domain scoping instruction restricts responses to Minecraft-related topics.
* No vector database, hence no embedding retrieval or retrieval-integrity controls.

### LLM09 - Misinformation

* Mandatory instruction tells the model to avoid fabrication and acknowledge uncertainty.
* Inbound replies are confidence-gated; low-confidence replies are replaced with `fallbackMessage`.

### LLM10 - Unbounded Consumption

* Mandatory instruction enforces concise responses.
* Per-player history is bounded by `historySize`.
* Outbound message rate is gated with cooldown enforcement (`coolDownInSeconds`).

## Colophon

<!-- BEGIN:DEVELOPERS_GUIDE -->
[Developer's Guide](https:/cliffano.github.io/developers-guide-nodejs.html)
<!-- END:DEVELOPERS_GUIDE -->

<!-- BEGIN:BUILD_REPORTS -->
Build reports:

* [Code complexity report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/complexity/plato/index.html)
* [Unit tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test/mocha.txt)
* [Test coverage report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/coverage/c8/index.html)
* [Integration tests report](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/test-integration/mocha.txt)
* [API Documentation](https://littlegodzillalaboratory.github.io/mineflayer-chatgpt/doc/jsdoc/index.html)

<!-- END:BUILD_REPORTS -->

Related projects:

* [minecraft-npc](https://github.com/littlegodzillalaboratory/minecraft-npc) - CLI for running NPC bot on Minecraft, powered by Mineflayer
