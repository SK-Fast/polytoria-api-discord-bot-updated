//////////////////////////////////////////
/*
            POLYTORIA COMMUNITY BOT
        BY DEVPIXELS, STARMANTHEGAMER(AKA BAGS)

    Script name: index.js
    Script label: Main Script
    Script Description: Used to process multiple stuff, Handling commands

*/
/////////////////////////////////////////

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { fork } = require('child_process');

require("dotenv").config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const fs = require('fs');

const commands = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    commands[file.replace(".js","")] = command
}

process.on('uncaughtException', (err) => {
    console.log(err)
  });

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (commands[interaction.commandName]) {
    commands[interaction.commandName].execute(client,interaction)
  }
});

client.login(process.env.TOKEN);

fork("cmd_register.js")