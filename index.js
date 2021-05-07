const Discord = require('discord.js');
const client = new Discord.Client();
const {google} = require('googleapis');
const calendar =google.calendar('v3');
const API_KEY=process.env.GAPI_TOKEN;
const unitariumBaseLink='http://time.unitarium.com/utc/';
const racingAnnnouncementsId=process.env.RACING_ANNOUNCEMENTS_CHANNEL_ID;
const randoInfoId=process.env.RANDO_INFO_CHANNEL_ID;
var faqCounter=0+process.env.FAQ_COUNTER;


client.once('ready', () => {
	client.user.setActivity('!faq',{type:'LISTENING'});
	console.log('[INIT] Ready!!');
});

client.on('message', message => {

	const embed = new Discord.MessageEmbed()
  // Calling !weekly
  if (message.content.toLowerCase()==='!weekly'){
		var answer='';
		let calendarPromise=calendar.events.list({
			"auth" : API_KEY,
			"calendarId" : "zsrstaff@gmail.com",
			"maxResults" : 1,
			"orderBy" : "startTime",
			"q" : "Minish Cap Randomizer Weekly",
			"singleEvents" : true,
			"timeMin" : new Date().toISOString()
		});
		calendarPromise.then(function(result){
			if (result.status!=200){
				console.log ('Error '+result.statusText);
				embed.setTitle('Unable to get calendar events!')
				.setColor(0xff0000)
				  message.channel.send(embed);
			} else {
				if (result.data.items.length){
				let nextEvent=result.data.items[0];
				let neTitle=nextEvent.summary;
				let neStartDate=new Date(nextEvent.start.dateTime);
				let neDescription=nextEvent.description;
				let neTwitchChannel=neDescription.match(/(https:\/\/(w{3}\.)?twitch\.tv\/[^\s\"]*)/m)[0];
				let now=new Date();
				let neGap=dhm(neStartDate-now);
				if (now>neStartDate){
					let neGap=dhm(now-neStartDate);
					embed.setTitle('Weekly is currently underway!')
					embed.setDescription('Weekly started ' +neGap.hours+' hours, ' +neGap.minutes+ ' minutes ago\n\n Head to '+ neTwitchChannel+' to watch it!')
					embed.setURL(neTwitchChannel);
					embed.setColor(0xffad21);
					message.channel.send(embed);
				} else {
			 	embed.setTitle('Next weekly is in '+ neGap.days+' days, '+neGap.hours+' hours, and ' +neGap.minutes+ ' minutes')
				if (neTitle.includes("Variety")){
					neDesc2=neDescription.replace("<br>","\n\r");
					if (neDesc2.match(/(This\ month's.*:.*)/) && neDesc2.match(/(This\ month's.*:.*)/).length>0){
						neVarietySettings=neDesc2.match(/(This\ month's.*:.*)/)[0];
						embed.setDescription("Next Weekly is the Variety Race!\n" + neVarietySettings + "\n\nRestream will be on: "+neTwitchChannel+"\n\nRace starts on the "+pad(neStartDate.getUTCDate())+'/'+pad(neStartDate.getUTCMonth()+1)+', at '+ pad(neStartDate.getUTCHours()) + ':' +pad(neStartDate.getUTCMinutes()) +' UTC');
					} else {
						var channel='<#'+racingAnnnouncementsId+'>';
						embed.setDescription("Next Weekly is the Variety Race! \n"+
						"Check "+ channel +" for more info about the settings."+
						" \n\nRestream will be on: "+neTwitchChannel+
						"\n\nRace starts on the "+pad(neStartDate.getUTCDate())+'/'+pad(neStartDate.getUTCMonth()+1)+', at '+ pad(neStartDate.getUTCHours()) + ':' +pad(neStartDate.getUTCMinutes()) +' UTC');
					}
				} else {
					embed.setDescription("Restream will be on: "+neTwitchChannel+"\n\nRace starts on the "+pad(neStartDate.getUTCDate())+'/'+pad(neStartDate.getUTCMonth()+1)+', at '+ pad(neStartDate.getUTCHours()) + ':' +pad(neStartDate.getUTCMinutes()) +' UTC');
				}
				embed.setURL(unitariumBaseLink+pad(neStartDate.getUTCHours())+pad(neStartDate.getUTCMinutes()));
				// "YELLARI" YELLOW 4 THE WIN
				embed.setColor(0xffad21);
				message.channel.send(embed);
			}
			} else {
				embed.setTitle('Didn\'t find any weekly!')
				.setColor(0xff0000)
				  message.channel.send(embed);
				}
			}
		});
  } else if (message.content.startsWith('!utc')) {
			let hours24;
			let hourstab=message.content.split(' ');
			if (hourstab.length>1){
				hours=hourstab[1];
			if (hours.includes('pm')){
					let hours12=parseInt(hours.split('pm')[0]);
					if (hours12 && hours12 <12){
						hours24=hours12+12;
					}
			} else if (hours.includes('am')) {
					let hours12=parseInt(hours.split('am')[0]);
					if (hours12 && hours12 <12){
						hours24=hours12;
					}
			} else {
				h24=parseInt(hours);
				if (h24 && h24 <24){
					hours24=h24;
					hours+='h';
				}
			}
			if (hours24){
				let now=new Date();
				let utcDate=new Date();
				utcDate.setUTCHours(hours24);
				utcDate.setUTCMinutes(0);
				utcDate.setUTCSeconds(0);
				if (utcDate<now){
					utcDate.setDate(utcDate.getDate()+1)
				}
				let gap=dhm(utcDate-now);
				let title=hours;
				title+=' UTC is in: ' +gap.hours +' hours and '+ gap.minutes + ' minutes';
				embed.setTitle(title)
				embed.setColor(0xffad21);
				embed.setURL(unitariumBaseLink+pad(utcDate.getUTCHours()));
				message.channel.send(embed);

		} else {
			embed.setTitle('I didn\'t understand the time you gave me.')
			embed.setDescription("Please use one of these formats:\n    - XXam\n    - XXpm\n    - XX    (24hr format)");
			embed.setColor(0xff0000);
			message.channel.send(embed);
		}
	} else {
		let now=new Date();
		let title = "It's " + now.getUTCHours() +":"+ now.getUTCMinutes() + " in UTC."
		embed.setTitle(title)
		var hours = now.getUTCHours();
		var minutes = now.getUTCMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		embed.setDescription(now.getUTCHours()+":"+ now.getUTCMinutes()+" / "+strTime);
		embed.setColor(0xffad21);
		message.channel.send(embed);
	}
} else if (message.content.startsWith('!faq')){
	var channel='<#'+randoInfoId+'>';
	embed.setTitle('To get started with the randomizer, please read our FAQ and startup guide.')
	faqCounter++;
	embed.setDescription('You can find them in '+channel+".\n\n Number of times called: " +faqCounter);
	embed.setColor(0xffad21);
	message.channel.send(embed);
}
})

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000);

  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return {
		'days':d,
		'hours':pad(h),
		'minutes':pad(m)
	};
}

function pad (n){
	return n < 10 ? '0' + n : n;
}
client.login(process.env.BOT_TOKEN);
