import dotenv from 'dotenv';
dotenv.config()
import { EmbedBuilder } from '@discordjs/builders';
const RANDO_INFO_CHANNEL_ID=process.env.RANDO_INFO_ID;

export default function yellariFAQCommand(interaction){
    const embed = new EmbedBuilder();
    console.log(RANDO_INFO_CHANNEL_ID)
    var channel='<#'+RANDO_INFO_CHANNEL_ID+'>';
    console.log(channel);
	embed.setTitle('To get started with the randomizer, please read our FAQ and startup guide.')
	embed.setDescription('You can find them in '+channel+".");
	embed.setColor(0xffad21);
	interaction.reply({embeds:[embed]});
}