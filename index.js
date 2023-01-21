require('dotenv').config();


const { Options, GatewayIntentBits } = require('discord.js');
const Client = require('./structures/Client');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

require('./handler/Event')(client);

const cmdHandler = require('./handler/Commands');

(async() => {
    await cmdHandler(client);
})