const { SlashCommandBuilder } = require('@discordjs/builders'); 
const axios = require('axios').default;
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const TimeConverter = require('timestamp-conv');

let CommandData = new SlashCommandBuilder()
.setName('guild')
.setDescription('Fetch information about targetted guild.')
.addStringOption(option =>
    option.setName('id')
        .setDescription("Provide a Targetted guild s' id or link!")
        .setRequired(true));


module.exports = {
    data: CommandData,
	execute(client,interaction) {
        async function getUser() {
            try {
            const response = await axios.get('https://api.polytoria.com/v1/guild/info?id=' + interaction.options.getString('id').replace(/\D/g,''));  
            const jsondata = response.data

            const JoinDate = new TimeConverter.timestamp(jsondata["CreatedAt"]).formatDay;

            const userdata = await (await axios.get('https://api.polytoria.com/v1/users/user?id=' + jsondata["CreatorID"])).data

            let embeddesc = ""
        
            let DescEmbedData = jsondata["Description"] == "" ? "No description set" : jsondata["Description"]
            embeddesc = embeddesc + "\n" + DescEmbedData

            let thumb = jsondata["Thumbnail"]

            if (jsondata["Thumbnail"] == null) {
                thumb = "https://polytoria.com/assets/img/game_unavail.png"
            }

            const userembed = new MessageEmbed()
            .setColor("#ff3636")
            .setTitle(jsondata["Name"])
            .setURL('https://polytoria.com/guilds/' + jsondata["ID"].toString())
            .setDescription(embeddesc)
            .setThumbnail(`${thumb}`)
            .addFields(
                { name: 'Owner', value: `[${userdata["Username"]}](https://polytoria.com/user/${userdata["ID"]})`, inline: true },
                { name: 'ID', value: jsondata["ID"].toString(), inline: true },
                { name: 'Members', value: jsondata["Members"].toString(), inline: true },
                { name: 'Created At', value: `${JoinDate}`, inline: false },
            )
            .setTimestamp()

            const gamelinkbtn = new MessageButton()
            .setLabel('Go to guild \'s page')
            .setStyle('LINK')
            .setURL('https://polytoria.com/guilds/' + jsondata["ID"].toString())

            const userlinkbtn = new MessageButton()
            .setLabel('Go to owner \'s page')
            .setStyle('LINK')
            .setURL('https://polytoria.com/user/' + userdata["ID"].toString())

            const row = new MessageActionRow()
			.addComponents(
				gamelinkbtn
			)
            .addComponents(
				userlinkbtn
			);

            interaction.reply({embeds: [ userembed ],components: [row] })
            
            } catch (error) {
                interaction.reply({ content: "Unexpected error happened and I couldn't fetch the game, Sorry :(\n\nError Type: `AXIOS_ERROR`", ephemeral: true })
              console.error(error);
            }
          }

          getUser()
	},
};