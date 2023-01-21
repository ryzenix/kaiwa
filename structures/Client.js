const { Client, Collection } = require("discord.js");
const winston = require('winston');

module.exports = class Bot extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.helps = new Collection();
        this.deletedChannels = new WeakSet();
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
            ],
            format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
        });
    };
};