const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const monthDb = require('../../../database/messagesWeekly.js');
const { monthString } = require('../../../handler/Util');
const { DateTime } = require('luxon');

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
        const sum = monthData.reduce((a, b) => a + b.count, 0);
        return {
            month: m,
            count: sum,
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
                label: `Monthly messages stats in ${currentTime.year}`,
                data: uniqueMonths.map(m => m.count),
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
                        precision: 0
                    },
                    grid: {
                        color: "#36A2EB"
                    },
                    title: {
                        display: true,
                        text: 'Message(s)'
                    }
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
        .setDescription('Monthly report for the amount of messages sent in server on the current year')
}