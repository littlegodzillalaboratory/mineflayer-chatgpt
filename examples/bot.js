"use strict"
import mineflayer from 'mineflayer';
import mineflayerChatgpt from 'mineflayer-chatgpt';

console.log('Initialising example bot...');
const bot = mineflayer.createBot({
  host: process.env.HOST,
  port: 25565,
  username: 'someplayer'
});
bot.on('kicked', console.log);
bot.on('error', console.error);
bot.once('end', console.log);

console.log('Loading Mineflayer ChatGPT plugin...')
bot.loadPlugin(mineflayerChatgpt.chatgpt);

console.log('Spawning example bot...');
bot.once('spawn', () => {
  bot.chatgpt.setConfig('sk-someinexistingapikey');
  bot.chatgpt.sendMessage('otherplayer', 'Hello');
  console.log('Example bot has been spawned');
  // Since we don't use a valid API key, the above call will log the following error message:
  // An unexpected error has occurred: An OpenAI error has occurred: 401 invalid_request_error invalid_api_key 401 Incorrect API key provided: sk-somei***********ikey. You can find your API key at https://platform.openai.com/account/api-keys.
});
