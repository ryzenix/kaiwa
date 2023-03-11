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
    memberId: reqString,
    guildId: reqString,
    duration: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model(
    'topMemberVoice',
    Schema,
    'topMemberVoice'
)