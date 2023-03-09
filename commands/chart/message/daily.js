const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const dailyDb = require('../../../database/messagesDaily.js');
const { DateTime } = require('luxon');

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


    const width = 400;
    const height = 400;
    const backgroundColour = 'white';
    const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const image = await canvas.renderToBuffer({
        type: "line",
        data: {
            labels: data.map(date => date.title),
            datasets: [{
                label: `Daily messages stats for ${interaction.guild.name}`,
                data: data.map(date => date.count),
                backgroundColor: ['red', 'blue', 'green', 'lightgray']
            }]
        }
    });
    return interaction.editReply({ files: [{ attachment: image, name: 'daily.png' }], content: "Update in UTC timezone" });
};

exports.info = {
    name: 'daily',
    description: 'Display a chart with the amount of messages sent in the server per day for the past week',
    slash: new SlashCommandSubcommandBuilder()
        .setName('daily')
        .setDescription('display a chart with the amount of messages sent in the server per day for the past week')
}