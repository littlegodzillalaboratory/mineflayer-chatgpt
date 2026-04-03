"use strict";
import leoProfanity from "leo-profanity";
import moderator from "../lib/moderator.js";
import referee from "@sinonjs/referee";
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
    const result = moderator.sanitiseProfanity("Shit, the dogwater got clapped");
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
