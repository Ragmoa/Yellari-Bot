export function dhm(t) {
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor((t - d * cd) / ch),
        m = Math.round((t - d * cd - h * ch) / 60000);

    if (m === 60) {
        h++;
        m = 0;
    }
    if (h === 24) {
        d++;
        h = 0;
    }
    return {
        'days': d,
        'hours': pad(h),
        'minutes': pad(m)
    };
}

export function pad(n) {
    return n < 10 ? '0' + n : n;
}


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

export function registerCommands(client) {
    var success = 0;

    commandList.forEach((command, index) => {
        client.application.commands.create(command).then(console.log()).catch((err) => {
            success--;
        });
        success++;
    });

    console.log(`Sucessfully registerd ${success} commands out of ${commandList.length}`);
}
