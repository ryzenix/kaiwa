const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);


module.exports = async(client) => {
    client.logger.info(`Initilizing commands files and folders....`)
    const cmdFiles = await globPromise(`${process.cwd()}/commands/*.js`);
    if (cmdFiles.length) {
        client.logger.info(`Found ${cmdFiles.length} individual command(s).`);
        for (const directory of cmdFiles) {
            const command = require(directory);
            client.commands.set(command.name, command);
        };
    };
}