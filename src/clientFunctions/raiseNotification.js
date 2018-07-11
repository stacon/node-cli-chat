const notifier = require('node-notifier');

const raiseNotification = (receivingNotifications, message, title = null) => {
    if (receivingNotifications) {
        notifier.notify({title, message});
    }
};

module.exports = { raiseNotification }