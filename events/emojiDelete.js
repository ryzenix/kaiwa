const emojisDb = require('../database/emojis.js');

module.exports = async(client, emoji) => {
    await emojisDb.findOneAndDelete({
        emojiId: emoji.id
    });
}