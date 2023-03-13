const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const monthDb = require('../../../database/messagesWeekly.js');
const { monthString } = require('../../../handler/Util');
const { DateTime } = require('luxon');

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
            labels: data.map(week => week.title),
            datasets: [{
                label: `Messages sent per week in ${monthString(currentTime.month)}`,
                data: data.map(week => week.count),
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
    return interaction.editReply({ files: [{ attachment: image, name: 'weekly.png' }], content: "Chart shown in [UTC Time](https://www.utctime.net/)." });
};

exports.info = {
    name: 'weekly',
    slash: new SlashCommandSubcommandBuilder()
        .setName('weekly')
        .setDescription('Weekly report for the amount of messages sent in the server in the past month')
}