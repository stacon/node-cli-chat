const socketio = require('socket.io-client'),
    os = require('os'),
    socket = socketio.connect('http://10.3.23.141:3636'),
    computerName = os.userInfo().username.toLowerCase(),
    { console_out, rl } = require('../common.js');

module.exports = {
    rl,
    socket,
    computerName,
    console_out
};
