const { SlashCommandBuilder } = require('@discordjs/builders'); 

let CommandData = new SlashCommandBuilder()
.setName('ping')
.setDescription('Checks if the bot is online!')

module.exports = {
    data: CommandData,
	execute(client,interaction) {
        interaction.reply({ content: `I'm online! :D (${Math.abs(Date.now() - interaction.createdTimestamp)}ms)`, ephemeral: true })
	},
};