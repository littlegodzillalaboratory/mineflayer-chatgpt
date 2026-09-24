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
bot.once('spawn', async () => {
  bot.chatgpt.setConfig({
    messageApiKey: 'sk-someapikey1',
    moderationApiKey: 'sk-someapikey2'
  });
  console.log('Example bot has been spawned');
  try {
    await bot.chatgpt.sendMessage('otherplayer', 'Hello');
  } catch {
    // This example deliberately uses invalid API keys. The plugin logs the
    // normalized OpenAI error; close the bot without an unhandled rejection.
    process.exitCode = 1;
    bot.quit();
  }
});
