import dotenv from 'dotenv';
dotenv.config();

import { Client, IntentsBitField, EmbedBuilder } from 'discord.js';
const client = new Client({ intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.DirectMessages] });

import { google } from 'googleapis';
const calendar = google.calendar('v3');

import casual from './commands/casual.js';
import faq from './commands/faq.js';
import utc from './commands/utc.js';
import weekly from './commands/weekly.js';
import { registerCommands } from './utils.js';

client.once('ready', () => {
    registerCommands(client);
    client.user.setActivity('type /', { type: 'LISTENING' });
    console.log('[INIT] Ready!!');
});

client.on('interactionCreate', interaction => {
    const embed = new EmbedBuilder();

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