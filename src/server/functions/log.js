const { color } = require('../../common.js');

function log(message, type = NotificationColor._default) {
    console.log(color(message, type));
}

const NotificationColor = {
    _default : 'off',
    _notice : 'cyan',
    _positive : 'green',
    _alert : 'yellow',
    _danger : 'red',
}

module.exports = { log, NotificationColor };
