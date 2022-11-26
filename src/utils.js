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

export function registerCommands() {
    var success = 0;
    commandList.forEach((command, index) => {
        client.interactions.createCommand(command).then(console.log()).catch((err) => {
            success--;
        });
        success++;
    });
    console.log("Sucessfully registerd " + success + " commands out of " + commandList.length);
    return;
}
