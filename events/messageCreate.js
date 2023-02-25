const emojisDb = require('../database/emojis.js');


module.exports = async(client, message) => {
    if (message.author.bot) return;

    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;

    const emojis = message.content.matchAll(regex);

    for (const emoji of emojis) {
        const guildEmoji = await message.guild.emojis.fetch(emoji[3]).catch(() => null);
        if (!guildEmoji) continue;
        else {
            await emojisDb.findOneAndUpdate({
                guildId: message.guild.id,
                emojiId: emoji[3]
            }, {
                guildId: message.guild.id,
                emojiId: emoji[3],
                $inc: {
                    count: 1
                },
            }, {
                upsert: true,
                new: true,
            });
        }
    }
}