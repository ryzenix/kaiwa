const { SlashCommandSubcommandBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const { loadImage } = require('canvas');
const memberVoiceDb = require('../../../database/memberVoice.js');
const moment = require('moment');
require('moment-duration-format')

exports.run = async(client, interaction) => {
    await interaction.deferReply();
    const members = await memberVoiceDb.find({
        guildId: interaction.guild.id,
    }).sort([
        ["duration", "descending"]
    ]).limit(10);

    if (!members || !members.length) return interaction.editReply({
        content: "There are little to no data to display!"
    });

    const fetchedMembers = await Promise.all(members.map(async(member) => {
        const guildMember = await interaction.guild.members.fetch(member.memberId).catch(() => null);
        if (!guildMember) {
            await memberVoiceDb.findOneAndDelete({
                memberId: emoji.emojiId
            });
            return null;
        };
        const imageLink = guildMember.displayAvatarURL({
            extension: 'png'
        });
        const imageData = await loadImage(imageLink);
        return { name: guildMember.nickname || guildMember.user.tag, duration: member.duration, imageData };
    })).then(arr => arr.splice(0, 9));


    if (fetchedMembers.filter(emoji => emoji).length < 1) return interaction.editReply({
        content: "There are little to no data to display!"
    });


    const width = 400;
    const height = 400;
    const backgroundColour = 'white';
    const canvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const image = await canvas.renderToBuffer({
        type: "bar",
        plugins: [{
            afterDraw: chart => {
                var ctx = chart.ctx;
                var xAxis = chart.scales.x;
                var yAxis = chart.scales.y;
                xAxis.ticks.forEach((value, index) => {
                    var x = xAxis.getPixelForTick(index);
                    ctx.drawImage(fetchedMembers[index].imageData, x - 12, yAxis.bottom + 10, 16, 16);
                });
            }
        }],
        data: {
            labels: fetchedMembers.map(member => member.name),
            datasets: [{
                label: `Top 10 members with most time spent in voice chat`,
                data: fetchedMembers.map(member => member.duration),
                backgroundColor: ['red', 'blue', 'green', 'lightgray']
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        padding: 20
                    },
                    grid: {
                        color: "#36A2EB"
                    },
                },
                y: {
                    ticks: {
                        precision: 0,
                        callback: (value) => {
                            return moment.duration(value).format('H[h] m[m] s[s]')
                        },
                    },
                    grid: {
                        color: "#36A2EB"
                    },
                },
            }
        }
    });
    return interaction.editReply({ files: [{ attachment: image, name: 'top.png' }] });
};

exports.info = {
    name: 'top',
    slash: new SlashCommandSubcommandBuilder()
        .setName('top')
        .setDescription('Display top 10 members with most time spent in voice chat')
}