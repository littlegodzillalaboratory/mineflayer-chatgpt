"use strict";
import assert from 'assert';
import Message from '../lib/message.js';

describe('message', function() {

  describe('retrieve properties', function() {
    beforeEach(function () {
      this.message = new Message('user', 'Hello');
    });
    it('should get role', function() {
      assert.equal(this.message.getRole(), 'user');
    });
    it('should get content', function() {
      assert.equal(this.message.getContent(), 'Hello');
    });
  });

  describe('different roles', function() {
    it('should support user role', function() {
      const message = new Message('user', 'Hello');
      assert.equal(message.getRole(), 'user');
      assert.equal(message.getContent(), 'Hello');
    });
    it('should support assistant role', function() {
      const message = new Message('assistant', 'Hi there!');
      assert.equal(message.getRole(), 'assistant');
      assert.equal(message.getContent(), 'Hi there!');
    });
    it('should support developer role', function() {
      const message = new Message('developer', 'Persona instruction');
      assert.equal(message.getRole(), 'developer');
      assert.equal(message.getContent(), 'Persona instruction');
    });
  });

});
