//////////////////////////////////////////
/*
    Script name: cmd_register.js
    Script label: Command Register
    Script Description: Register Slash commands.
*/
/////////////////////////////////////////

require("dotenv").config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = process.env.APP_ID;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

console.log("Starting register slash comamnd process..")

async function StartReg() {
    try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

StartReg()