import dotenv from 'dotenv';
dotenv.config()
import { EmbedBuilder } from '@discordjs/builders';
import  {google} from 'googleapis';
import pad from '../utils/pad.js';
import dhm from '../utils/dhm.js';
const calendar=google.calendar('v3');
const API_KEY=process.env.GAPI_TOKEN;

export default function yellariWeeklyCommand(interaction) {
    const embed = new EmbedBuilder();
    let calendarPromise = calendar.events.list({
        "auth": API_KEY,
        "calendarId": "zsrstaff@gmail.com",
        "maxResults": 1,
        "orderBy": "startTime",
        "q": "Minish Cap Randomizer Weekly",
        "singleEvents": true,
        "timeMin": new Date().toISOString()
    });
    calendarPromise.then(function (result) {
        if (result.status != 200) {
            console.log('Error ' + result.statusText);
            embed.setTitle('Unable to get calendar events!')
                .setColor(0xff0000)
            interaction.reply({embeds:[embed]});
        } else {
            if (result.data.items.length) {
                let nextEvent = result.data.items[0];
                let neTitle = nextEvent.summary;
                let neStartDate = new Date(nextEvent.start.dateTime);
                let neDescription = nextEvent.description;
                

                let neTwitchChannel = (neDescription.match(/(https:\/\/(w{3}\.)?twitch\.tv\/[^\s\"]*)/m) && neDescription.match(/(https:\/\/(w{3}\.)?twitch\.tv\/[^\s\"]*)/m).length > 0) ? 
                                      neDescription.match(/(https:\/\/(w{3}\.)?twitch\.tv\/[^\s\"]*)/m)[0] : null;
                let now = new Date();
                let neGap = dhm(neStartDate - now);
                if (now > neStartDate) {
                    let neGap = dhm(now - neStartDate);
                    embed.setTitle('Weekly is currently underway!')
                    embed.setDescription('Weekly started ' + neGap.hours + ' hours, ' + neGap.minutes + ' minutes ago\n\n'+(neTwitchChannel? 'Head to ' + neTwitchChannel + ' to watch it!':''))
                    if (neTwitchChannel!==null){
                        embed.setURL(neTwitchChannel);
                    }
                    embed.setColor(0xffad21);
                    interaction.reply({embeds:[embed]});
                } else {
                    embed.setTitle('Next weekly is in ' + neGap.days + ' days, ' + neGap.hours + ' hours, and ' + neGap.minutes + ' minutes')
                    let timeStamp = neStartDate.getTime().toString().substring(0, 10);
                    if (neTitle.includes("Variety")) {
                        neDesc2 = neDescription.replace("<br>", "\n\r");
                        if (neDesc2.match(/(This\ month's.*:.*)/) && neDesc2.match(/(This\ month's.*:.*)/).length > 0) {
                            neVarietySettings = neDesc2.match(/(This\ month's.*:.*)/)[0];
                            embed.setDescription("Next Weekly is the Variety Race!\n" + neVarietySettings + "\n\nRestream will be on: " + neTwitchChannel + "\n\nRace starts on the " + pad(neStartDate.getUTCDate()) + '/' + pad(neStartDate.getUTCMonth() + 1) + ', at ' + pad(neStartDate.getUTCHours()) + ':' + pad(neStartDate.getUTCMinutes()) + ' UTC');
                        } else {
                            var channel = '<#' + racingAnnnouncementsId + '>';
                            embed.setDescription("Next Weekly is the Variety Race! \n" +
                                "Check " + channel + " for more info about the settings." +
                                (neTwitchChannel ? " \n\nRestream will be on: " + neTwitchChannel:'') +
                                "\n\nRace starts on the <t:" + timeStamp + ':D>, at <t:' + timeStamp + ':t>');
                        }
                    } else {
                        embed.setDescription("" + (neTwitchChannel?"Restream will be on: " + neTwitchChannel: "")+ "\n\nRace starts on the <t:" + timeStamp + ':D>, at <t:' + timeStamp + ':t>');
                    }
                    // "YELLARI" YELLOW 4 THE WIN
                    embed.setColor(0xffad21);
                    interaction.reply({embeds:[embed]});
                }
            } else {
				embed.setTitle('Didn\'t find any weekly!')
				.setColor(0xff0000)
				  interaction.reply({embeds:[embed]});
				}
			}
        }
    )
}




                
            
        
    
