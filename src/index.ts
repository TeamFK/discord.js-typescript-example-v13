// If you want more information please check out https://discordjs.guide for a well written guide for v13

import { Client, Intents, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

require('dotenv').config();

// This tells discord what our intentions with the bot is, you can find them through Intents.FLAGS or
const bot: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

const token: any = process.env.TOKEN; // Get token from our .env
const guildID: any = process.env.GUILDID; // Get the guild ID from our .env
const applicationID: any = process.env.APPID; // Get app ID from our .env

const wait = require('util').promisify(setTimeout); // declare wait for our interactions
bot.login(token); // bot logs into discord

// This is called when your bot is ready, if you want to set its status you would do it here
bot.once('ready', () => {
  console.log(`\x1b[92m[Discord] \u001b[37m${bot.user?.username} Ready`);
});

// This is your slash command area if you cant figure out how to add more to your liking check out the guide at https://discordjs.guide/interactions/registering-slash-commands.html
const commands = [new SlashCommandBuilder().setName('ping').setDescription('Ping!')].map((command: any) =>
  command.toJSON()
);

const rest = new REST({ version: '9' }).setToken(token);

// Now this async function tells discord our slash commands and registers them to the guild ID we put in the .env file
(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(applicationID, guildID), {
      body: commands,
    });

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();

// This is called every time an interaction is created, so this means buttons or slash commands
bot.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction; // Get the commands name from interaction

  switch (commandName) {
    case 'ping': {
      await interaction.deferReply(); // Makes it say "bot is thinking..."
      await wait(150); // Wait 150ms before replying
      await interaction.editReply('Pong!'); // Here we have to use editReply because we defered it first (if you dont want to defer it you can just use .reply())
      break;
    }
  }
});
