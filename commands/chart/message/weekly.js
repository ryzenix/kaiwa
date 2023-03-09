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
    console.log(data);

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
            labels: data.map(week => week.title),
            datasets: [{
                label: `Weekly messages stats for ${interaction.guild.name} in ${monthString(currentTime.month)}`,
                data: data.map(week => week.count),
                backgroundColor: ['red', 'blue', 'green', 'lightgray']
            }]
        }
    });
    return interaction.editReply({ files: [{ attachment: image, name: 'weekly.png' }], content: "Update in UTC timezone" });
};

exports.info = {
    name: 'weekly',
    description: 'Display a chart with the amount of messages sent in the server per week for the past month',
    slash: new SlashCommandSubcommandBuilder()
        .setName('weekly')
        .setDescription('display a chart with the amount of messages sent in the server per week for the past month')
}