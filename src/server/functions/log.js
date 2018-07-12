const { color } = require('../../common.js');

function log(type, message = NotificationColor._default) {
    console.log(color(message, type));
}

const NotificationColor = {
    _default = 'off',
    _notice = 'cyan',
    _positive = 'green',
    _alert = 'red',
    _danger = 'yellow',
}

module.exports = { log, NotificationColor };
