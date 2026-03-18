"use strict";
import assert from 'assert';
import Memory from '../lib/memory.js';
import Message from '../lib/message.js';

describe('memory', function() {

  describe('manage player conversations', function() {
    beforeEach(function () {
      this.memory = new Memory();
      this.memory.initialize('someplayer');
      const message = new Message('user', 'Hello');
      this.memory.register('someplayer', message);
    });
    it('should return true when checking for an existing player', function() {
      assert.equal(this.memory.exists('someplayer'), true);
    });
    it('should return false when checking for an inexisting player', function() {
      assert.equal(this.memory.exists('inexistingplayer'), false);
    });
    it('should retrieve conversation for an existing player', function() {
      const conversation = this.memory.retrieve('someplayer');
      assert.notEqual(conversation, undefined);
      const messages = conversation.getMessages();
      assert.equal(messages.length, 1);
      assert.equal(messages[0].getRole(), 'user');
      assert.equal(messages[0].getContent(), 'Hello');
    });
    it('should initialize a new conversation for a new player on retrieve', function() {
      const conversation = this.memory.retrieve('newplayer');
      assert.notEqual(conversation, undefined);
      assert.deepEqual(conversation.getMessages(), []);
    });
    it('should register multiple messages in a conversation', function() {
      const reply = new Message('assistant', 'Hi there!');
      this.memory.register('someplayer', reply);
      const messages = this.memory.retrieve('someplayer').getMessages();
      assert.equal(messages.length, 2);
      assert.equal(messages[0].getContent(), 'Hello');
      assert.equal(messages[1].getContent(), 'Hi there!');
    });
  });

});
