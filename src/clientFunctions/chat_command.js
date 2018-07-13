const { CommandType, rl, MessageType, console_out, color } = require('../common.js'),
    { socket } = require('./clientInit.js'),
    { showAvailableCommands } = require('./showAvailableCommands.js'),
    { rollDice } = require('./rollDice.js');


function chat_command(data) {
    const { user, cmd, arg } = data;
    switch (cmd) {
        case CommandType._emote: {
            const emote = user.fullname + " " + arg;
            socket.emit('send', { type: MessageType._notice, message: emote });
            break;
        }

        case CommandType._tfs: {
            if (arg) {
                socket.emit('send', { type: MessageType._tfs, tfsNumber: arg, nick: user.fullname });
                return;
            }
            console_out(color('A proper tfs command needs a ticket id argument!"', "yellow"))
            break;
        }

        case CommandType._whisper: {
            const whisper = {
                type: MessageType._whisper,
                receiverComputerName: arg.substr(0, 6),
                message: arg.substr(7, arg.length)
            };
            const { receiverComputerName, type, message } = whisper;
            if (receiverComputerName[0] && receiverComputerName[0].toLowerCase() === 'x' && receiverComputerName.match(/^x\d{5}$/) && receiverComputerName.length === 6) {
                socket.emit('send', { type , receiverComputerName, message });
                rl.prompt(true);
                user.lastWhisperedUser = receiverComputerName;
                console_out(color(`You -> ${receiverComputerName}: ${message}`, 'magenta'));
                return;
            }
            console_out(color('A proper whisper looks like this "/w x90562 Hello there!"', "yellow"));
            break;
        }

        case CommandType._whisperToPrevious: { //TODO: TO be refactored on server side
            const newArg = `${user.lastWhisperedUser} ${arg}`;
            if (user.lastWhisperedUser) {
                chat_command({
                    cmd: CommandType._whisper,
                    arg: newArg,
                    user
                });
                return;
            }
            console_out(color('You haven\'t whispered to someone yet', 'yellow'));
            break;
        }

        case CommandType._rename: {
            user.changeNickName(arg);
            socket.emit('server_request', { type: CommandType._rename , newNickname: user.nickname });
            break;
        }

        case CommandType._toggle_notifications: {
            user.receivingNotifications = !user.receivingNotifications;
            if (user.receivingNotifications) {
                console_out(color('Notifications turned ON', 'yellow'));
                return;
            }
            console_out(color('Notifications turned OFF', 'red'));
            break;
        }
        case CommandType._roll: {
            if (arg && !isNaN(arg) && arg > 0) {
                rollDice(user, arg);
            } else {
                rollDice(user, 1);
            }
            break;
        }
        case CommandType._online: {
            socket.emit('server_request', {type: CommandType._online});
            break;
        }
        case CommandType._serverCommand: {
            const commandArgs = arg.split(" ");
            const command = {
                type: CommandType._serverCommand,
                option: commandArgs[0],
                target: commandArgs[1] || 'all',
                message: commandArgs[2] || ' '
            };
            socket.emit('server_request', command);
            rl.prompt(true);
            break;
        }
        case CommandType._exit: {
            process.exit(1);
            break;
        }
        default:
            showAvailableCommands();
    }
}

module.exports = { chat_command };
