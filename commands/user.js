const { SlashCommandBuilder } = require('@discordjs/builders'); 
const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const TimeConverter = require('timestamp-conv');

let CommandData = new SlashCommandBuilder()
.setName('user')
.setDescription('Fetch information about targetted user.')
.addStringOption(option =>
    option.setName('username')
        .setDescription("Provide a Targetted player s' username!")
        .setRequired(true));


module.exports = {
    data: CommandData,
	execute(client,interaction) {
        async function getUser() {
            try {
            const response = await axios.get('https://api.polytoria.com/v1/users/getbyusername?username=' + interaction.options.getString('username'));  
            const jsondata = response.data

            const JoinDate = new TimeConverter.timestamp(jsondata["JoinedAt"]).formatDay;
            const LastSeenDate = new TimeConverter.timestamp(jsondata["LastSeenAt"]).formatDay;

            let embeddesc = ""

            if (jsondata["Rank"] == "ADMINISTRATOR") {
                embeddesc = embeddesc + "<:staff:906010778165973022> This user is a staff member!\n"
            }

            if (jsondata["MembershipType"] == "PRO") {
                embeddesc = embeddesc + "<:ProMember:906016237748879392> This user is a pro member!\n"
            }

            if (jsondata["MembershipType"] == "PRO_UNLIMITED") {
                embeddesc = embeddesc + "<:ProMember:906016237748879392> This user is a pro ultimate member!\n"
            }

            let DescEmbedData = jsondata["Description"] == "" ? "No description set" : jsondata["Description"]
            embeddesc = embeddesc + "\n" + DescEmbedData
 
            const userembed = new MessageEmbed()
            .setColor('#ff3636')
            .setTitle(jsondata["Username"])
            .setURL('https://polytoria.com/user/' + jsondata["ID"].toString())
            .setDescription(embeddesc)
            .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/headshots/${jsondata["AvatarHash"]}.png`)
            .addFields(
                { name: 'ID', value: jsondata["ID"].toString(), inline: true },
                { name: 'Profile Views', value: jsondata["ProfileViews"].toString(), inline: true },
                { name: 'Item Sales', value: jsondata["ItemSales"].toString(), inline: true },
                { name: 'Forum Posts', value: jsondata["ForumPosts"].toString(), inline: false },
                { name: 'Trade Value', value: jsondata["TradeValue"].toString(), inline: true },
                { name: 'Join Date', value: `${JoinDate}`, inline: true },
                { name: 'Last seen Date', value: `${LastSeenDate}`, inline: false },
            )
            .setTimestamp()

            interaction.reply({embeds: [ userembed ]})

            
            } catch (error) {
                interaction.reply({ content: "Unexpected error happened and I couldn't fetch the user, Sorry :(\n\nError Type: `AXIOS_ERROR`", ephemeral: true })
              console.error(error);
            }
          }

          getUser()
	},
};