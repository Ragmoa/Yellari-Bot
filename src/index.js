require('dotenv').config();

const { Client, IntentsBitField, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.DirectMessages] });

const { google } = require('googleapis');
const calendar = google.calendar('v3');

const { casual } = require('./commands/casual');
const { faq } = require('./commands/faq');
const { utc } = require('./commands/utc');
const { weekly } = require('./commands/weekly');
const { registerCommands } = require('./utils');

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