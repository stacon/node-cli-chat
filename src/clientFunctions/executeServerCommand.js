const {ServerCommand, console_out, color} = require('../common.js');

function executeServerCommand(commandInfo) {
    const {option, message} = commandInfo;
    switch (option) {
        case ServerCommand._terminate: {
            console_out(color(message, 'red'));
            process.exit(1);
            break;
        }
        case ServerCommand._kick: {
            console_out(color(message, 'red'));
            process.exit(1);
            break;
        }
    }

}

module.exports = {executeServerCommand};