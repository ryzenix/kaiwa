const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const dailyDb = require('../../../database/voiceDaily.js');
const { DateTime } = require('luxon');
const moment = require('moment');
require('moment-duration-format')

exports.run = async(client, interaction) => {
    await interaction.deferReply();
    const currentTime = DateTime.now().setZone('utc');
    const data = await dailyDb.find({
        weekNumber: currentTime.weekNumber,
        guildId: interaction.guild.id,
    }).sort([
        ["dayNumber", "ascending"]
    ]);

    if (!data || !data.length) return interaction.editReply({
        content: "There are little to no data to display!"
    });


    const width = 700;
    const height = 400;
    const backgroundColour = 'white';
    const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const image = await canvas.renderToBuffer({
        type: "line",
        data: {
            labels: data.map(date => date.title),
            datasets: [{
                label: `Time spent in voice chat in the last week`,
                data: data.map(date => date.duration),
                backgroundColor: ['red'],
                borderColor: "red",
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    suggestedMin: 0,
                    ticks: {
                        precision: 0,
                        callback: (value) => {
                            return moment.duration(value).format('H[h] m[m] s[s]')
                        },
                        autoSkipPadding: 20,
                        autoSkip: true
                    },
                    grid: {
                        color: "#36A2EB"
                    },
                },
                x: {
                    grid: {
                        color: "#36A2EB"
                    }
                }
            }
        }
    });
    return interaction.editReply({ files: [{ attachment: image, name: 'daily.png' }], content: "Update in UTC timezone" });
};

exports.info = {
    name: 'daily',
    slash: new SlashCommandSubcommandBuilder()
        .setName('daily')
        .setDescription('Daily report for the amount of time sent in voice channels in the past week')
}