const color = require("ansi-color").set,
    readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

const CommandType = {
    _emote: 'me',
    _rename: 'nick',
    _tfs: 'tfs',
    _whisper: 'w',
    _whisperToPrevious: 'r',
    _toggle_notifications: 'tn',
    _roll: 'roll',
    _online: 'on',
    _exit: 'exit',
    _serverCommand: 'sc'
}

const MessageType = {
    _chat: 'chat',
    _notice: 'notice',
    _whisper: 'whisper',
    _tfs: 'tfs',
    _error: 'error',
    _serverCommand: 'serverCommand'
}

const ServerCommand = {
    _terminate: 'terminate',
    _kick: 'kick'
}

const Status = {
    _offline: 'offline',
    _online: 'online',
    _afk: 'afk',
    _busy: 'busy'
};

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    rl.prompt(true);
}

module.exports = { MessageType, CommandType, ServerCommand, color, console_out, rl, Status}
