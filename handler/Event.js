const { readdirSync } = require("fs");
const { Events } = require('discord.js');
module.exports = client => {
    const events = readdirSync("./events/");
    for (let event of events) {
        let file = require(`../events/${event}`);
        client.on(Events[event.split(".")[0]], (...args) => file(client, ...args));
    };
};