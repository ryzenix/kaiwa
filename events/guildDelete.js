const emojisDb = require('../database/emojis.js');
const dailyDb = require('../database/messagesDaily.js');
const monthlyDb = require('../database/messagesWeekly.js');
const dailyVoiceDb = require('../database/voiceDaily.js');
const monthlyVoiceDb = require('../database/voiceWeekly.js');
const memberVoiceDb = require('../database/memberVoice.js');

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
    await dailyVoiceDb.findOneAndDelete({
        guildId: guild.id
    });
    await monthlyVoiceDb.findOneAndDelete({
        guildId: guild.id
    });
    await memberVoiceDb.findOneAndDelete({
        guildId: guild.id
    });
}