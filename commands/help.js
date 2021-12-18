const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { MessageEmbed } = require('discord.js');
const disbutpages = require("discord-embeds-pages-buttons")

let CommandData = new SlashCommandBuilder()
.setName('help')
.setDescription('Want to know commands?')

module.exports = {
    data: CommandData,
	execute(client,interaction) {
        const userembed = new MessageEmbed()
        .setColor('#ff3636')
        .setTitle("Commands")
        .setDescription("Prefix: Slash command")
        .addFields(
            { name: 'help', value: "<:reply:921697036783452240> Command that you're using.", inline: false },
            { name: 'ping', value: "<:reply:921697036783452240> Checks if the bot is online, Also give ping number", inline: false },
            { name: 'game', value: "<:reply:921697036783452240> Fetch information about targetted game.", inline: false },
            { name: 'guild', value: "<:reply:921697036783452240> Fetch information about targetted guild.", inline: false },
            { name: 'user', value: "<:reply:921697036783452240> Fetch information about targetted user.", inline: false },
            { name: 'convert', value: "<:reply:921697036783452240> Convert currency", inline: false },
        )
        .setFooter("Polytoria Community bot - Version " + process.env.npm_package_version)

        interaction.reply({embeds: [userembed], ephemeral: true})
	},
};