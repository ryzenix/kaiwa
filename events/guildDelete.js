const emojisDb = require('../database/emojis.js');
const dailyDb = require('../database/messagesDaily.js');
const monthlyDb = require('../database/messagesWeekly.js');

module.exports = async(client, guild) => {
    await emojisDb.findOneAndDelete({
        guildId: guild.id
    });
    await dailyDb.findOneAndDelete({
        guildId: guild.id
    });
    await monthlyDb.findOneAndDelete({
        guildId: guild.id
    });
}