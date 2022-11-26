import { dhm } from "../utils";

export default function weekly(interaction, embed, calendar) {
    let calendarPromise = calendar.events.list({
        "auth": process.env.GAPI_TOKEN,
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
                .setColor(0xff0000);
            message.channel.send(embed);

        } else {
            if (result.data.items.length) {
                let nextEvent = result.data.items[0];
                let neTitle = nextEvent.summary;
                let neStartDate = new Date(nextEvent.start.dateTime);
                let neDescription = nextEvent.description;
                let neTwitchChannel = neDescription.match(/(https:\/\/(w{3}\.)?twitch\.tv\/[^\s\"]*)/m)[0];
                let now = new Date();
                let neGap = dhm(neStartDate - now);

                if (now > neStartDate) {
                    let neGap = dhm(now - neStartDate);

                    embed.setTitle('Weekly is currently underway!');
                    embed.setDescription('Weekly started ' + neGap.hours + ' hours, ' + neGap.minutes + ' minutes ago\n\n Head to ' + neTwitchChannel + ' to watch it!');
                    embed.setURL(neTwitchChannel);
                    embed.setColor(0xffad21);

                    interaction.reply({ embeds: [embed] });
                } else {
                    embed.setTitle('Next weekly is in ' + neGap.days + ' days, ' + neGap.hours + ' hours, and ' + neGap.minutes + ' minutes');
                    let timeStamp = neStartDate.getTime().toString().substring(0, 10);

                    if (neTitle.includes("Variety")) {
                        neDesc2 = neDescription.replace("<br>", "\n\r");

                        if (neDesc2.match(/(This\ month's.*:.*)/) && neDesc2.match(/(This\ month's.*:.*)/).length > 0) {
                            neVarietySettings = neDesc2.match(/(This\ month's.*:.*)/)[0];
                            embed.setDescription("Next Weekly is the Variety Race!\n" + neVarietySettings + "\n\nRestream will be on: " + neTwitchChannel + "\n\nRace starts on the " + pad(neStartDate.getUTCDate()) + '/' + pad(neStartDate.getUTCMonth() + 1) + ', at ' + pad(neStartDate.getUTCHours()) + ':' + pad(neStartDate.getUTCMinutes()) + ' UTC');
                        } else {
                            var channel = '<#' + process.env.RACING_ANNOUNCEMENTS_CHANNEL_ID + '>';
                            embed.setDescription("Next Weekly is the Variety Race! \n" +
                                "Check " + channel + " for more info about the settings." +
                                " \n\nRestream will be on: " + neTwitchChannel +
                                "\n\nRace starts on the <t:" + timeStamp + ':D>, at <t:' + timeStamp + ':t>');
                        }
                    } else {
                        embed.setDescription("Restream will be on: " + neTwitchChannel + "\n\nRace starts on the <t:" + timeStamp + ':D>, at <t:' + timeStamp + ':t>');
                    }

                    // "YELLARI" YELLOW 4 THE WIN
                    embed.setColor(0xffad21);
                    interaction.reply({ embeds: [embed] });
                }
            } else {
                embed.setTitle('Didn\'t find any weekly!')
                    .setColor(0xff0000);
                interaction.reply({ embeds: [embed] });
            }
        }
    });
}