import { EmbedBuilder } from '@discordjs/builders';
import dhm from '../utils/dhm.js';
const RACING_ANNOUNCEMENTS_CHANNEL_ID=process.env.RACING_ANNOUNCEMENTS_CHANNEL_ID;

export default function yellariCasualCommand(interaction){
    const embed = new EmbedBuilder();
    let nextCasual=new Date();
    let daysGap=(10-nextCasual.getUTCDay())%7;
    nextCasual.setDate(nextCasual.getDate()+daysGap);
    nextCasual.setUTCHours(18);
    nextCasual.setUTCMinutes(0);
    nextCasual.setUTCSeconds(0);
    let now=new Date();
    let ncGap=dhm(nextCasual-now);
    let timeStamp = nextCasual.getTime().toString().substring(0,10);
    embed.setTitle('Next casual weekly is in '+ ncGap.days+' days, '+ncGap.hours+' hours, and ' +ncGap.minutes+ ' minutes');
    embed.setDescription("The race should start on the <t:"+timeStamp+":D>, around <t:"+timeStamp+":t>\nRace room will open at some point.");
    embed.setColor(0xffad21);
    interaction.reply({embeds:[embed]});

}