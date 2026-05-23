#!/usr/bin/env bash
set -o nounset
set -o errexit

cd ../

printf "\n\n========================================\n"
printf "Install dependencies of Mineflayer ChatGPT:\n"
npm install

printf "\n\n========================================\n"
printf "Link Mineflayer ChatGPT:\n"
npm link mineflayer-chatgpt

cd examples/

printf "\n\n========================================\n"
printf "Start example bot:\n"
node mineflayer-chatgpt-bot.js
