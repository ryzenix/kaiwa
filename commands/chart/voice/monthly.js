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
        yearNumber: currentTime.year,
        guildId: interaction.guild.id,
    }).sort([
        ["monthNumber", "ascending"]
    ]);
    if (!data || !data.length) return interaction.editReply({
        content: "There are little to no data to display!"
    });
    const uniqueMonths = [...new Set(data.map(month => month.monthNumber))].map((m) => {
        const monthData = data.filter(month => month.monthNumber === m);
        const sum = monthData.reduce((a, b) => a + b.duration, 0);
        return {
            month: m,
            duration: sum,
            title: monthString(m - 1)
        }
    });

    const width = 700;
    const height = 400;
    const backgroundColour = 'white';
    const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const image = await canvas.renderToBuffer({
        type: "line",
        data: {
            labels: uniqueMonths.map(m => m.title),
            datasets: [{
                label: `Time spent in voice chat in the last year`,
                data: uniqueMonths.map(date => date.duration),
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
                        }
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
    return interaction.editReply({ files: [{ attachment: image, name: 'monthly.png' }], content: "Chart shown in [UTC Time](https://www.utctime.net/)." });
};

exports.info = {
    name: 'monthly',
    slash: new SlashCommandSubcommandBuilder()
        .setName('monthly')
        .setDescription('Montly report for the amount of time sent in voice channels on the current year')
}