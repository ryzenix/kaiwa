module.exports = (client) => {
    return client.logger.log(`[DISCORD] ${client.user.tag} has logged in!`)
}