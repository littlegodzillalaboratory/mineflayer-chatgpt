#!/usr/bin/env bash
set -o nounset
set -o errexit

printf "\n\n========================================\n"
printf "Install dependencies of example bot:\n"
npm link

cd ../

printf "\n\n========================================\n"
printf "Install dependencies of Mineflayer ChatGPT:\n"
npm install

printf "\n\n========================================\n"
printf "Link local Mineflayer ChatGPT:\n"
npm link mineflayer-chatgpt

printf "\n\n========================================\n"
printf "Start example bot:\n"
node bot.js
