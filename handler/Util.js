module.exports = class Util {
    static fetchSubCommand(interaction) {
        try {
            const subCommandGroupName = interaction.options.getSubcommandGroup();
            const subCommandName = interaction.options.getSubcommand();
            return { subCommandGroupName, subCommandName }
        } catch {
            return null;
        };
    };
    static dayString(index) {
        const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayOfWeek[index];
    }
    static monthString(index) {
        const monthOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOfYear[index];
    }
}