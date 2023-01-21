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
                new winston.transports.Console({
                    handleExceptions: true,
                }),
                new winston.transports.DailyRotateFile({
                    filename: "logs/output/output-%DATE%.log",
                    datePattern: "YYYY-MM-DD-HH",
                    frequency: "24h",
                    maxSize: "20m",
                    level: "info",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple()
                    ),
                }),
                new winston.transports.DailyRotateFile({
                    filename: "logs/error/error-%DATE%.log",
                    datePattern: "YYYY-MM-DD-HH",
                    maxSize: "20m",
                    frequency: "24h",
                    level: "error",
                    format: winston.format.combine(
                        winston.format.errors({ stack: true }),
                        winston.format.timestamp(),
                        winston.format.simple()
                    ),
                    handleExceptions: true,
                }),
            ],
            format: winston.format.combine(
                winston.format.timestamp(),
                errorStackFormat(),
                winston.format.printf(
                    (log) =>
                        `${log.timestamp} ${log.level.toUpperCase()}: ${log.message}${
                            log.error ? `\n${log.stack}` : ""
                        }`
                )
            ),
        });
    };
};