const { SlashCommandBuilder } = require('@discordjs/builders'); 
const axios = require('axios').default;
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const TimeConverter = require('timestamp-conv');
const palette = require('image-palette')
const pixels = require('image-pixels')

let CommandData = new SlashCommandBuilder()
.setName('game')
.setDescription('Fetch information about targetted game.')
.addStringOption(option =>
    option.setName('id')
        .setDescription("Provide a Targetted game s' id or link!")
        .setRequired(true));


module.exports = {
    data: CommandData,
	execute(client,interaction) {
        async function getUser() {
            try {
            const response = await axios.get('https://api.polytoria.com/v1/games/info?id=' + interaction.options.getString('id').replace(/\D/g,''));  
            const jsondata = response.data

            const JoinDate = new TimeConverter.timestamp(jsondata["CreatedAt"]).formatDay;
            const LastSeenDate = new TimeConverter.timestamp(jsondata["UpdatedAt"]).formatDay;

            const userdata = await (await axios.get('https://api.polytoria.com/v1/users/user?id=' + jsondata["CreatorID"])).data

            let embeddesc = ""

            let ratio = Math.round(jsondata["Likes"] / (jsondata["Likes"] + jsondata["Dislikes"]) * 100)

            if (isNaN(ratio)) {
                ratio = "No rating yet."
            } else {
                if (ratio > 90) {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Very positive)"
                } else if (ratio > 70) {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Mostly positive)"
                } else if (ratio > 50) {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Almost negative)"
                } else if (ratio > 35) {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Negavtive)"
                } else if (ratio > 20) {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Mostly Negavtive)"
                } else {
                    ratio = ratio.toString()
                    ratio = ratio + "%(Very Negavtive)"
                }
            }

            embeddesc = embeddesc + `**Created by** [${userdata["Username"]}](https://polytoria.com/user/${userdata["ID"]})\n`

            embeddesc = embeddesc + `**Like/Dislike ratio**: ${ratio}\n`

            let ActiveEmbedData = jsondata["IsActive"] == true ? "" : "This game is inactive.\n"
            embeddesc = embeddesc + ActiveEmbedData

            let DescEmbedData = jsondata["Description"] == "" ? "No description set" : jsondata["Description"]
            embeddesc = embeddesc + "\n" + DescEmbedData

            let thumb = jsondata["Thumbnail"]

            if (jsondata["Thumbnail"] == null) {
                thumb = "https://polytoria.com/assets/img/game_unavail.png"
            }

            const userembed = new MessageEmbed()
            .setColor("#ff3636")
            .setTitle(jsondata["Name"])
            .setURL('https://polytoria.com/games/' + jsondata["ID"].toString())
            .setDescription(embeddesc)
            .setThumbnail(`${thumb}`)
            .addFields(
                { name: 'ID', value: jsondata["ID"].toString(), inline: true },
                { name: 'Visits', value: jsondata["Visits"].toString(), inline: true },
                { name: 'Likes', value: jsondata["Likes"].toString(), inline: true },
                { name: 'Dislikes', value: jsondata["Dislikes"].toString(), inline: false },
                { name: 'Created At', value: `${JoinDate}`, inline: true },
                { name: 'Updated At', value: `${LastSeenDate}`, inline: true },
            )
            .setTimestamp()

            const gamelinkbtn = new MessageButton()
            .setLabel('Go to game \'s page')
            .setStyle('LINK')
            .setURL('https://polytoria.com/games/' + jsondata["ID"].toString())

            const userlinkbtn = new MessageButton()
            .setLabel('Go to creator \'s page')
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