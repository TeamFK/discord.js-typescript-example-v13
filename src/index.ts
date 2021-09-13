import { Client, Intents, Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

require('dotenv').config();

const bot: Client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

const token: any = process.env.TOKEN;
const guildID: any = process.env.GUILDID;
const applicationID: any = process.env.APPID;

const wait = require('util').promisify(setTimeout);
bot.login(token);

bot.once('ready', () => {
  console.log(`\x1b[92m[Discord] \u001b[37m${bot.user?.username} Ready`);
});

const commands = [new SlashCommandBuilder().setName('ping').setDescription('Ping!')].map((command: any) =>
  command.toJSON()
);

const rest = new REST({ version: '9' }).setToken(token);

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

bot.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case 'ping': {
      await interaction.deferReply();
      await wait(150);
      await interaction.editReply('Pong!');
      break;
    }
  }
});
