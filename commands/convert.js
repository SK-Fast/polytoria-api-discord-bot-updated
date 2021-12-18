const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { MessageEmbed } = require('discord.js');

let CommandData = new SlashCommandBuilder()
.setName('convert')
.setDescription('Convert Currency between studs to bricks.')
.addStringOption(option =>
    option.setName('type')
        .setDescription('Convert type')
        .setRequired(true)
        .addChoice('Stud to Brick', 's2b')
        .addChoice('Brick to Stud', 'b2s')
    )
.addNumberOption(option =>
	option.setName('value')
		.setDescription('Set how many do you want it to be converted!')
		.setRequired(true));

module.exports = {
    data: CommandData,
	execute(client,interaction) {
        const converttype = interaction.options.getString('type');
        const val = interaction.options.getNumber('value');

        let ResultEmbed

        if (converttype == "s2b") {

            let Calculated = Math.round(Number(val) / 15)
            let Left = Number(val) % 15
        
            ResultEmbed = new MessageEmbed()
            .setTitle("Studs --> Bricks")
            .setDescription(`**${val}**  <:stud:905987085347983411> --> **${Calculated}**  <:brick:905987077995376640>\nStud removed from Convert currency: **${Left}**  <:stud:905987085347983411>`)
             .setColor('#92e714')

        } else {

            let Calculated = Math.round(Number(val) * 15)

            ResultEmbed = new MessageEmbed()
            .setTitle("Bricks --> Studs")
            .setDescription(`**${val}**  <:brick:905987077995376640> --> **${Calculated}**  <:stud:905987085347983411>`)
            .setColor('#fe5953')
            

        }

        interaction.reply({embeds: [ ResultEmbed ]})


	},
};