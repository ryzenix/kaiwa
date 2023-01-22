const { SlashCommandBuilder } = require('@discordjs/builders');

exports.run = async(client, interaction) => {
    const pingMessage = await interaction.reply({ content: `almost there...`, fetchReply: true });
    const createdTimestamp = pingMessage.createdTimestamp || new Date(pingMessage.timestamp).getTime();
    const ping = createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply(`:ping_pong: pong! took me ${ping}ms, and Discord ${Math.round(client.ws.ping)}ms`);
};

exports.info = {
    name: 'ping',
    description: 'ping pong ding dong ching chong',
    slash: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping pong ding dong ching chong')
}