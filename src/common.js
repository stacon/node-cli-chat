const color = require("ansi-color").set;

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

module.exports = { MessageType, CommandType, ServerCommand, color }
