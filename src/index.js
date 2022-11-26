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
const API_KEY = process.env.GAPI_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;
const randoInfoId = process.env.RANDO_INFO_CHANNEL_ID;
const racingAnnnouncementsId = process.env.RACING_ANNOUNCEMENTS_CHANNEL_ID;

const unitariumBaseLink = 'http://time.unitarium.com/utc/';

const commandList = [
    {
        name: "weekly",
        description: "Displays information about the next weekly race"
    },
    {
        name: "casual",
        description: "Displays information about the next casual weekly race"
    },
    {
        name: "utc",
        description: "Displays UTC submitted time in every user's timezone",
        options: [
            {
                name: "time",
                description: "UTC hour and minutes in the HH:MM format",
                required: false,
                type: 3
            },
            {
                name: "ampm",
                description: "am or pm ?",
                required: false,
                type: 3,
                choices: [
                    {
                        name: "am",
                        value: "am",
                    },
                    {
                        name: "pm",
                        value: "pm"
                    }
                ]
            }
        ]
    },
    {
        name: "faq",
        description: "Displays a link to the FAQ and general informations"
    }
];

client.once('ready', () => {
    registerCommands();
    client.user.setActivity('type /', { type: 'LISTENING' });
    console.log('[INIT] Ready!!');
});

client.on('interactionCreate', interaction => {
    const embed = new MessageEmbed();

    if (interaction.commandName === 'weekly') {
        weekly(interaction, embed, calendar);
    } else if (interaction.commandName === "utc") {
        utc(interaction, embed);
    } else if (interaction.commandName === "faq") {
        faq(interaction, embed);
    } else if (interaction.commandName === 'casual') {
        casual(interaction, embed);
    }
});

client.login(BOT_TOKEN);