# MOFH Discord Bot
## What is this?
This is code created, and put into the public domain to help people with their projects and learn.  

## What can I do with this bot?
You can use it to manage your own free host on mofh network.

## What do I need to run this code?
### Node.JS
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
[Website](https://nodejs.org)

### Discord.JS
A powerful library for interacting with the Discord API.
[NPM](https://npmjs.com/package/discord.js)
[Website](https://discord.js.org)

## Getting started
To get install all needed packages, use `npm install`. You **must** put a Discord **bot** token in `config.json` and make sure to rename `dotenv` to `.env` and enter your **mofh username and key** in the .env file. Once you've done that make sure to whitelist the IP on mofh. You can use `npm start` to start the bot.

> Do not put a user account token in `config.json`. [Selfbotting is against Discord's Terms Of Services and you risk account termination](https://support.discord.com/hc/en-us/articles/115002192352-Automated-user-accounts-self-bots) by using one.
