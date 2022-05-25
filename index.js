const { Client, Intents, MessageEmbed } = require('discord.js');
const interactions = require ("discord-slash-commands-client")
const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});
const {google} = require('googleapis');
const calendar =google.calendar('v3');
const API_KEY=process.env.GAPI_TOKEN;
const BOT_TOKEN=process.env.BOT_TOKEN;
const BOT_ID=process.env.BOT_ID;
const randoInfoId=process.env.RANDO_INFO_CHANNEL_ID;

const unitariumBaseLink='http://time.unitarium.com/utc/';
const racingAnnnouncementsId=process.env.RACING_ANNOUNCEMENTS_CHANNEL_ID;
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

client.interactions = new interactions.Client(BOT_TOKEN,BOT_ID);

client.once('ready', () => {
	registerCommands();
	client.user.setActivity('type /',{type:'LISTENING'});
	console.log('[INIT] Ready!!');
});

client.on('interactionCreate', interaction => {
	const embed = new MessageEmbed()
  // Calling /weekly
  if (interaction.commandName==='weekly'){
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
				 interaction.reply({embeds:[embed]});
				} else {
			 	embed.setTitle('Next weekly is in '+ neGap.days+' days, '+neGap.hours+' hours, and ' +neGap.minutes+ ' minutes')
        let timeStamp = neStartDate.getTime().toString().substring(0,10);
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
						"\n\nRace starts on the <t:"+timeStamp+':D>, at <t:'+timeStamp+':t>');
					}
				} else {
					embed.setDescription("Restream will be on: "+neTwitchChannel+"\n\nRace starts on the <t:"+timeStamp+':D>, at <t:'+timeStamp+':t>');
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
		});
  } else if (interaction.commandName === "utc") {
			let hours24;
			let options=Object.fromEntries(interaction.options);
			let suffix='';
			if ('ampm' in options){
				suffix=options['ampm']['value'];
			}
			if ('time'in options){
					time=options['time']['value'];
					if (time.includes(':')){
						  let hourstab2=time.split(':');
							minutes=parseInt(hourstab2[1]);
								hours=hourstab2[0];
					  } else {
							minutes=0;
						  hours=time;
					}
			if (suffix=='pm'){
					if (hours>0 && hours <=12 && minutes >=0 && minutes <=59){
						hours24=parseInt(hours,10)+12;
					}
			} else if (suffix=='am') {
					if (hours>0 && hours <=12 && minutes >=0 && minutes <=59){
						hours24=parseInt(hours,10);
					}
			} else {
				h24=parseInt(hours,10);
				if (h24 && h24 <24 && minutes >=0 && minutes <=59){
					hours24=h24;
				}
			}
			if (hours24){
				let now=new Date();
				let utcDate=new Date();
				utcDate.setUTCHours(hours24);
				utcDate.setUTCMinutes(minutes);
				utcDate.setUTCSeconds(0);
				if (utcDate<now){
					utcDate.setDate(utcDate.getDate()+1)
				}
				let gap=dhm(utcDate-now);
				if (suffix=='am' || suffix=="pm"){
					title=pad(parseInt(hours)) + ':' + pad(minutes) + ' ' + suffix;
				} else {
					title=pad(parseInt(hours)) + ':' + pad(minutes);
				}
				title+=' UTC is in: ' +gap.hours +' hours and '+ gap.minutes + ' minutes';
				embed.setTitle(title)
				embed.setColor(0xffad21);
				embed.setURL(unitariumBaseLink+pad(utcDate.getUTCHours()));
				interaction.reply({embeds:[embed]});

		} else {
			embed.setTitle('I didn\'t understand the time you gave me.')
			embed.setDescription("Please use one of these formats:\n    - XX(:XX) am\n    - XX(:XX) pm\n    - XX(:XX)    (24hr format)");
			embed.setColor(0xff0000);
			interaction.reply({embeds:[embed]});
		}
	} else {
		let now=new Date();
		let title = "It's " + now.getUTCHours() +":"+ pad(now.getUTCMinutes()) + " in UTC."
		embed.setTitle(title)
		var hours = now.getUTCHours();
		var minutes = now.getUTCMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		var strTime = hours + ':' + pad(minutes) + ' ' + ampm;
		embed.setDescription(now.getUTCHours()+":"+ pad(now.getUTCMinutes())+" / "+strTime);
		embed.setColor(0xffad21);
		interaction.reply({embeds:[embed]});
	}
} else if (interaction.commandName === "faq"){
	var channel='<#'+randoInfoId+'>';
	embed.setTitle('To get started with the randomizer, please read our FAQ and startup guide.')
	embed.setDescription('You can find them in '+channel+".");
	embed.setColor(0xffad21);
	interaction.reply({embeds:[embed]});
} else if (interaction.commandName==='casual'){
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
      embed.setDescription("The race should start on the <t:"+timeStamp+":D>, around <t:"+timeStamp+":t>\nRace room should open at some point, when Hendrus feels like it.");
    embed.setColor(0xffad21);
    interaction.reply({embeds:[embed]});
  }
})
client.login(BOT_TOKEN);

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

function registerCommands(){
	var success=0;
	commandList.forEach((command,index) => {
		client.interactions.createCommand(command).then(console.log()).catch((err) => {
			success--;
		});
		success++;
	})
	console.log("Sucessfully registerd " + success + " commands out of " + commandList.length);
	return ;
}
