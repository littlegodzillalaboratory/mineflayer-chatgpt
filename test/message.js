"use strict";
import assert from "assert";
import Message from "../lib/message.js";

describe("message", function () {
  describe("retrieve properties", function () {
    beforeEach(function () {
      this.timestamp = Date.now();
      this.message = new Message("user", "Hello", this.timestamp);
    });
    it("should get role", function () {
      assert.equal(this.message.getRole(), "user");
    });
    it("should get content", function () {
      assert.equal(this.message.getContent(), "Hello");
    });
    it("should get timestamp", function () {
      assert.equal(typeof this.message.getTimestamp(), "number");
      assert.equal(this.message.getTimestamp(), this.timestamp);
    });
  });

  describe("different roles", function () {
    it("should support user role", function () {
      const message = new Message("user", "Hello", Date.now());
      assert.equal(message.getRole(), "user");
      assert.equal(message.getContent(), "Hello");
    });
    it("should support assistant role", function () {
      const message = new Message("assistant", "Hi there!", Date.now());
      assert.equal(message.getRole(), "assistant");
      assert.equal(message.getContent(), "Hi there!");
    });
    it("should support developer role", function () {
      const message = new Message(
        "developer",
        "Persona instruction",
        Date.now(),
      );
      assert.equal(message.getRole(), "developer");
      assert.equal(message.getContent(), "Persona instruction");
    });

    it("should default timestamp to now when not provided", function () {
      const beforeTimestamp = Date.now();
      const message = new Message("assistant", "Hi there!");
      const afterTimestamp = Date.now();
      assert.equal(typeof message.getTimestamp(), "number");
      assert.equal(message.getTimestamp() >= beforeTimestamp, true);
      assert.equal(message.getTimestamp() <= afterTimestamp, true);
    });

    it("should support custom timestamp", function () {
      const message = new Message("assistant", "Hi there!", 123456789);
      assert.equal(message.getTimestamp(), 123456789);
    });
  });
});
