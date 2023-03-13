const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const dailyDb = require('../../../database/messagesDaily.js');
const { DateTime } = require('luxon');

exports.run = async(client, interaction) => {
    await interaction.deferReply();
    const currentTime = DateTime.now().setZone('utc');
    const data = await dailyDb.find({
        monthNumber: currentTime.month,
        guildId: interaction.guild.id,
    }).sort([
        ["dayNumber", "ascending"]
    ]).limit(7);

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
                label: `Daily messages stats for the last 7 days`,
                data: data.map(date => date.count),
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
    return interaction.editReply({ files: [{ attachment: image, name: 'daily.png' }], content: "Chart shown in [UTC Time](https://www.utctime.net/)." });
};

exports.info = {
    name: 'daily',
    slash: new SlashCommandSubcommandBuilder()
        .setName('daily')
        .setDescription('Daily report for the amount of messages sent in server in the past week')
}