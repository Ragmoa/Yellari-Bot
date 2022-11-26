const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const { google } = require('googleapis');
const { default: casual } = require('./commands/casual');
const { default: faq } = require('./commands/faq');
const { default: utc } = require('./commands/utc');
const { default: weekly } = require('./commands/weekly');
const { registerCommands } = require('./utils');
const calendar = google.calendar('v3');

require('dotenv').config();

client.once('ready', () => {
    registerCommands();
    client.user.setActivity('type /', { type: 'LISTENING' });
    console.log('[INIT] Ready!!');
});

client.on('interactionCreate', interaction => {
    const embed = new MessageEmbed();

    switch (interaction.commandName) {
        case 'weekly':
            weekly(interaction, embed, calendar);
            break;

        case 'utc':
            utc(interaction, embed);
            break;

        case 'faq':
            faq(interaction, embed);
            break;

        case 'casual':
            casual(interaction, embed);
            break;
    }
});

client.login(process.env.BOT_TOKEN);