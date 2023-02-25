const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const emojisSchema = mongoose.Schema({
  emojiId: reqString,
  guildId: reqString,
  count: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model(
  'emojis',
  emojisSchema,
  'emojis'
)