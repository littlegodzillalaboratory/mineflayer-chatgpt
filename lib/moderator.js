import leoProfanity from "leo-profanity";
import OpenAI from "openai";

function sanitiseProfanity(message) {
  return leoProfanity.clean(message);
}

// Detects whether a message contains a Minecraft-style slash command.
// LLM05 - Improper Output Handling
function detectSlashCommand(message) {
  return /(^|\s)\/[a-z][a-z0-9_:-]*/i.test(message);
}

// Uses OpenAI's moderation API to check if the message violates content policy.
// Returns an object with:
// - flagged: boolean indicating if content was flagged
// - categories: object with category flags (e.g., hate, violence, sexual)
// - category_scores: object with confidence scores for each category
// - message: the original message that was moderated
async function moderateMessage(openAIClient, message) {
  const moderation = await openAIClient.moderations.create({
    input: message,
  });
  const result = moderation.results[0];
  return {
    flagged: result.flagged,
    categories: result.categories,
    category_scores: result.category_scores,
    message: message,
  };
}

const exports = {
  sanitiseProfanity: sanitiseProfanity,
  detectSlashCommand: detectSlashCommand,
  moderateMessage: moderateMessage,
};

export { exports as default };
