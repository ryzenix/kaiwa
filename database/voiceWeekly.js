const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}


const Schema = mongoose.Schema({
    title: reqString,
    weekNumber: reqNumber,
    monthNumber: reqNumber,
    yearNumber: reqNumber,
    guildId: reqString,
    duration: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model(
    'voiceWeekly',
    Schema,
    'voiceWeekly'
)