const emojisDb = require('../database/emojis.js');
const dailyDb = require('../database/messagesDaily.js');
const { dayString, monthString } = require('../handler/Util');
const { DateTime } = require('luxon');
const monthlyDb = require('../database/messagesWeekly.js');

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
    };
    const currentDate = DateTime.now().setZone('utc');;
    await dailyDb.findOneAndUpdate({
        weekNumber: currentDate.weekNumber,
        dayNumber: currentDate.day,
        monthNumber: currentDate.month,
        yearNumber: currentDate.year,
        guildId: message.guild.id
    }, {
        title: dayString(currentDate.weekday - 1),
        weekNumber: currentDate.weekNumber,
        dayNumber: currentDate.day,
        monthNumber: currentDate.month,
        yearNumber: currentDate.year,
        guildId: message.guild.id,
        $inc: {
            count: 1
        },
    }, {
        upsert: true,
        new: true,
    })
    await monthlyDb.findOneAndUpdate({
        weekNumber: currentDate.weekNumber,
        monthNumber: currentDate.month,
        yearNumber: currentDate.year,
        guildId: message.guild.id
    }, {
        title: `Week ${Math.round(currentDate.daysInMonth / 7)}`,
        weekNumber: currentDate.weekNumber,
        monthNumber: currentDate.month,
        yearNumber: currentDate.year,
        guildId: message.guild.id,
        $inc: {
            count: 1
        },
    }, {
        upsert: true,
        new: true,
    })
}