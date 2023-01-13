# Yellari-Bot
A discord Bot for Minish Cap Randomizer Races

## Invite Link

Use this link to add Yellari to your server: https://discord.com/api/oauth2/authorize?client_id=686271218999230540&permissions=2147503104&scope=bot

## Install

You need an updated version of Node.js (>=16.9.0)

- run ```npm install```

- Create a seedGen Folder with a MinishCap randomizer CLI inside it, an EU Minish cap ROM, and an empty "generated" folder. Make sure the bot has a full acess to that folder.

- add a .env file which will store the app parameters:
  - GAPI_TOKEN = GOOGLE API CALENDAR TOKEN
  - BOT_TOKEN = DISCORD BOT TOKEN
  - BOT_ID = DISCORD APP ID
  - RANDO_INFO_ID = RANDO INFO CHANNEL ID
  - RACING_ANNOUNCEMENTS_CHANNEL_ID = RACING ANNOUCEMENTS CHANNEL ID
  - SEEDGEN_FOLDER = PATH TO THE SEEDGEN FOLDER


- run the Bot with ```node .``` in the main folder.

More info on discord bots:
 - https://discordapp.com/developers/docs/intro
 - https://discordjs.guide/preparations/setting-up-a-bot-application.html
 - https://discordjs.guide/preparations/adding-your-bot-to-servers.html
