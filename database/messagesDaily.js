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
    dayNumber: reqNumber,
    weekNumber: reqNumber,
    monthNumber: reqNumber,
    yearNumber: reqNumber,
    guildId: reqString,
    count: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model(
    'messagesDaily',
    Schema,
    'messagesDaily'
)