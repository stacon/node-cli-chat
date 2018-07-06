const CommandType = {
    _emote: 'me',
    _rename: 'nick',
    _tfs: 'tfs',
    _whisper: 'w',
    _toggle_notifications: 'tn',
    _roll: 'roll',
    _online: 'online'
}

const MessageType = {
    _chat: 'chat',
    _notice: 'notice',
    _emote: 'emote',
    _whisper: 'whisper',
    _tfs: 'tfs'
}

module.exports = { MessageType, CommandType }
