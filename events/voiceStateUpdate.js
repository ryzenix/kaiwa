const memberVoiceDb = require('../database/memberVoice');
const dailyVoiceDb = require('../database/voiceDaily');
const monthlyVoiceDb = require('../database/voiceWeekly');
const { dayString } = require('../handler/Util');
const { DateTime } = require('luxon');

module.exports = async(client, oldState, newState) => {
    if (!newState.guild) return;
    if (newState.member.user.bot) return;
    if (oldState.channelId === newState.channelId) return;
    if (oldState.channelId === null) {
        const joinTimestamp = Date.now();
        if (!oldState.guild.voiceDuration) oldState.guild.voiceDuration = new Map();
        if (!oldState.guild.voiceDuration.has(newState.sessionId)) oldState.guild.voiceDuration.set(newState.sessionId, {
            joinTimestamp,
            memberId: newState.id
        });
    } else if (newState.channelId === null) {
        if (!newState.guild.voiceDuration) return;
        const data = newState.guild.voiceDuration.get(newState.sessionId);
        if (!data) return;
        const currentTime = Date.now();
        const duration = currentTime - data.joinTimestamp;
        await memberVoiceDb.findOneAndUpdate({
            guildId: newState.guild.id,
            memberId: data.memberId,
        }, {
            guildId: newState.guild.id,
            memberId: data.memberId,
            $inc: {
                duration
            },
        }, {
            upsert: true,
            new: true,
        });
        const localDate = DateTime.now().setZone('utc');
        await dailyVoiceDb.findOneAndUpdate({
            weekNumber: localDate.weekNumber,
            dayNumber: localDate.day,
            monthNumber: localDate.month,
            yearNumber: localDate.year,
            guildId: newState.guild.id
        }, {
            title: dayString(localDate.weekday - 1),
            weekNumber: localDate.weekNumber,
            dayNumber: localDate.day,
            monthNumber: localDate.month,
            yearNumber: localDate.year,
            guildId: newState.guild.id,
            $inc: {
                duration
            },
        }, {
            upsert: true,
            new: true,
        });
        await monthlyVoiceDb.findOneAndUpdate({
            weekNumber: localDate.weekNumber,
            monthNumber: localDate.month,
            yearNumber: localDate.year,
            guildId: newState.guild.id
        }, {
            title: `Week ${Math.round(localDate.daysInMonth / 7)}`,
            weekNumber: localDate.weekNumber,
            monthNumber: localDate.month,
            yearNumber: localDate.year,
            guildId: newState.guild.id,
            $inc: {
                duration
            },
        }, {
            upsert: true,
            new: true,
        })
        newState.guild.voiceDuration.delete(newState.sessionId);
    }
}