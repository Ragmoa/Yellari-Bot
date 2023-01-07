import dotenv from 'dotenv';
dotenv.config()
import { Client, GatewayIntentBits, Routes, REST } from 'discord.js';
const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages]});

const BOT_TOKEN=process.env.BOT_TOKEN;
const BOT_ID=process.env.BOT_ID;

const rest= new REST({version: '10' }).setToken(BOT_TOKEN);
import yellariWeeklyCommand from './commands/weeklyCommand.js';
import yellariUTCCommand from './commands/utcCommand.js';
import yellariFAQCommand from './commands/faqCommand.js';
import yellariCasualCommand from './commands/casualCommand.js';

const commandList=[
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
				choices:[
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
]


client.once('ready', () => {
	registerCommands();
	console.log('[INIT] - Yellari Ready!!');
});

client.on('interactionCreate',  async interaction => {

	try{
	// ONLY ANSWER TO RECORDED COMMANDS
	if (!interaction.isChatInputCommand()){
		return ;
	}

	switch (interaction.commandName){
		case 'weekly':{
			yellariWeeklyCommand(interaction)
			break;
		}
		case 'utc':{
			yellariUTCCommand(interaction)
			break;
		}
		case 'faq':{
			yellariFAQCommand(interaction)
			break;
		}
		case 'casual':{
			yellariCasualCommand(interaction)
			break;
		}
			
	}

} catch (e){
	console.error(e)
}
}


)
client.login(BOT_TOKEN);





async function registerCommands(){

	try {
		console.log('Updating Registerd commands')
		await rest.put(Routes.applicationCommands(BOT_ID),{body:commandList})
		console.log('Sucessfully registered command list')
	} catch (err){
		console.log('Could not register commands: '.err)
	}

	return ;
}
