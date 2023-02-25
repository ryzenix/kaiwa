const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const { loadImage, createCanvas } = require('canvas')
const emojisDb = require('../../../database/emojis.js');

exports.run = async(client, interaction) => {
    await interaction.deferReply();
    const emojis = await emojisDb.find({
        guildId: interaction.guild.id,
    }).sort([
        ["count", "descending"]
    ]);

    if (!emojis || !emojis.length) return interaction.editReply({
        content: "There are little to no data to display regarding emojis avaliable on the server!"
    });

    const fetchedEmojis = await Promise.all(emojis.map(async (emoji) => {
        const guildEmoji = await interaction.guild.emojis.fetch(emoji.emojiId).catch(() => null);
        if (!guildEmoji) {
            await emojisDb.findOneAndDelete({
                guildId: interaction.guild.id,
                emojiId: emoji.emojiId
            });
            return null;
        }
        const imageData = await loadImage(`${guildEmoji.url}?size=16`);
        return { name: guildEmoji.name, count: emoji.count, imageData };
    })).then(arr => arr.splice(0, 9));


    if (fetchedEmojis.filter(emoji => emoji).length < 1) return interaction.editReply({
        content: "A number of emojis were deleted from the server, and there are little to no data to display regarding emojis avaliable on the server!"
    });
    

    const width = 400;
    const height = 400;
    const backgroundColour = 'white';
    const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

    const image = await canvas.renderToBuffer({
        type: "bar",
        plugins: [{
            afterDraw: chart => {
                var ctx = chart.ctx; 
                var xAxis = chart.scales.x;
                var yAxis = chart.scales.y;
                xAxis.ticks.forEach((value, index) => {  
                    var x = xAxis.getPixelForTick(index);   
                    ctx.drawImage(fetchedEmojis[index].imageData, x - 12, yAxis.bottom + 10);
                });      
            }
        }],
        data: {
            labels: fetchedEmojis.map(emoji => `:${emoji.name}:`),
            datasets: [{
                label: `Top 10 most used emojis in ${interaction.guild.name}`,
                data: fetchedEmojis.map(emoji => emoji.count),
                backgroundColor: ['red', 'blue', 'green', 'lightgray']
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        padding: 20 
                    }
                },
                y: { 
                    ticks: {
                      beginAtZero: true
                    }
                },
            }
        }
    });
    return interaction.editReply({ files: [{ attachment: image, name: 'top.png' }] });
};

exports.info = {
    name: 'top',
    description: 'Display top 10 most used emojis in the server',
    slash: new SlashCommandSubcommandBuilder()
    .setName('top')
    .setDescription('Display top 10 most used emojis in the server')
}