const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const monthDb = require('../../../database/voiceWeekly.js');
const { monthString } = require('../../../handler/Util');
const { DateTime } = require('luxon');
const moment = require('moment');
require('moment-duration-format')

exports.run = async(client, interaction) => {
    await interaction.deferReply();
    const currentTime = DateTime.now().setZone('utc');
    const data = await monthDb.find({
        monthNumber: currentTime.month,
        guildId: interaction.guild.id,
    }).sort([
        ["weekNumber", "ascending"]
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
                label: `Time spent in voice chat during ${monthString(currentTime.month)}`,
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
    return interaction.editReply({ files: [{ attachment: image, name: 'weekly.png' }], content: "Update in UTC timezone" });
};

exports.info = {
    name: 'weekly',
    slash: new SlashCommandSubcommandBuilder()
        .setName('weekly')
        .setDescription('Weekly report for the amount of time sent in voice channels for the past month')
}