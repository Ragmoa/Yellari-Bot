import { dhm, pad } from "../utils";

const unitariumBaseLink = 'http://time.unitarium.com/utc/';

export default function utc(interaction, embed) {
    let hours24;
    let options = Object.fromEntries(interaction.options);
    let suffix = '';

    if ('ampm' in options) {
        suffix = options['ampm']['value'];
    }

    if ('time' in options) {
        time = options['time']['value'];

        if (time.includes(':')) {
            let hourstab2 = time.split(':');
            minutes = parseInt(hourstab2[1]);
            hours = hourstab2[0];
        } else {
            minutes = 0;
            hours = time;
        }

        if (suffix == 'pm') {
            if (hours > 0 && hours <= 12 && minutes >= 0 && minutes <= 59) {
                hours24 = parseInt(hours, 10) + 12;
            }
        } else if (suffix == 'am') {
            if (hours > 0 && hours <= 12 && minutes >= 0 && minutes <= 59) {
                hours24 = parseInt(hours, 10);
            }
        } else {
            h24 = parseInt(hours, 10);

            if (h24 && h24 < 24 && minutes >= 0 && minutes <= 59) {
                hours24 = h24;
            }
        }

        if (hours24) {
            let now = new Date();
            let utcDate = new Date();

            utcDate.setUTCHours(hours24);
            utcDate.setUTCMinutes(minutes);
            utcDate.setUTCSeconds(0);

            if (utcDate < now) {
                utcDate.setDate(utcDate.getDate() + 1);
            }

            let gap = dhm(utcDate - now);

            if (suffix == 'am' || suffix == "pm") {
                title = pad(parseInt(hours)) + ':' + pad(minutes) + ' ' + suffix;
            } else {
                title = pad(parseInt(hours)) + ':' + pad(minutes);
            }

            title += ' UTC is in: ' + gap.hours + ' hours and ' + gap.minutes + ' minutes';

            embed.setTitle(title);
            embed.setColor(0xffad21);
            embed.setURL(unitariumBaseLink + pad(utcDate.getUTCHours()));

            interaction.reply({ embeds: [embed] });

        } else {
            embed.setTitle('I didn\'t understand the time you gave me.');
            embed.setDescription("Please use one of these formats:\n    - XX(:XX) am\n    - XX(:XX) pm\n    - XX(:XX)    (24hr format)");
            embed.setColor(0xff0000);

            interaction.reply({ embeds: [embed] });
        }
    } else {
        let now = new Date();
        let title = "It's " + now.getUTCHours() + ":" + pad(now.getUTCMinutes()) + " in UTC.";

        embed.setTitle(title);

        var hours = now.getUTCHours();
        var minutes = now.getUTCMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        var strTime = hours + ':' + pad(minutes) + ' ' + ampm;

        embed.setDescription(now.getUTCHours() + ":" + pad(now.getUTCMinutes()) + " / " + strTime);
        embed.setColor(0xffad21);

        interaction.reply({ embeds: [embed] });
    }
}