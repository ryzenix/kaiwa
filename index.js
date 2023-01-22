require('dotenv').config();

const fs = require("fs");

if (!fs.existsSync("logs")) fs.mkdirSync("logs");

if (!fs.existsSync("logs/output")) fs.mkdirSync("logs/output");
if (!fs.existsSync("logs/error")) fs.mkdirSync("logs/error");

const { Options, GatewayIntentBits } = require('discord.js');
const Client = require('./structures/Client');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

require('./handler/Event')(client);

(async() => {
    await require('./handler/Commands')(client);
})()