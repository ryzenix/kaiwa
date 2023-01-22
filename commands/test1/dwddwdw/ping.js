const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');

exports.run = async(client, interaction) => {
    const pingMessage = await interaction.reply({ content: `almost there...`, fetchReply: true });
    const createdTimestamp = pingMessage.createdTimestamp || new Date(pingMessage.timestamp).getTime();
    const ping = createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply(`:ping_pong: pong! took me ${ping}ms, and Discord ${Math.round(client.ws.ping)}ms`);
};

exports.info = {
    name: 'ddddd',
    description: 'do a few good things',
    slash: new SlashCommandSubcommandBuilder()
    .setName('ddddd')
    .setDescription('bad shuit')
}