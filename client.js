'use strict'
const { MessageType,
        CommandType,
        color } = require('./src/common.js'),
{
    notify,
    showAvailableCommands,
    console_out,
    rl,
    socket,
    computerName,
    executeServerCommand
} = require('./src/clientFunctions.js'),
    user = new User();

// Notifications appear based on this boolean's value
let receivingNotifications = true;
let lastWhisperedUser = null;

rl.question("Please enter a nickname: ", name => {
    user.changeNickName(name);
    socket.emit('connectAnnounce', { type: 'event', user });
    rl.prompt(true);
});

rl.on('line', line => {
    if (line[0] === "/" && line.length > 1) {
        const cmd = line.match(/[A-z]+\b/)[0].toLowerCase();
        const arg = line.substr(cmd.length + 2, line.length);
        chat_command(cmd, arg);

    } else {
        // send chat message
        socket.emit('send', { type: 'chat', message: line, nick: user.fullname });
        rl.prompt(true);
    }
});

function chat_command(cmd, arg) {
    switch (cmd) {
        case CommandType._emote: {
            const emote = user.fullname + " " + arg;
            socket.emit('send', { type: MessageType._notice, message: emote });
            break;
        }

        case CommandType._tfs: {
            socket.emit('send', { type: MessageType._tfs, tfsNumber: arg, nick: user.fullname });
            break;
        }

        case CommandType._whisper: {
            const whisper = {
                type: MessageType._whisper,
                receiverComputerName: arg.substr(0, 6),
                message: arg.substr(7, arg.length)
            };
            const { receiverComputerName, type, message } = whisper;
            if (receiverComputerName[0].toLowerCase() === 'x' && receiverComputerName.match(/^x\d{5}$/) && receiverComputerName.length === 6) {
                socket.emit('send', { type , receiverComputerName, message });
                rl.prompt(true);
                lastWhisperedUser = receiverComputerName;
                console_out(color(`You -> ${receiverComputerName}: ${message}`, 'magenta'));
                return;
            }
                console_out(color('A proper whisper looks like this "/w x90562 Hello there!"', "yellow"));
                break;
        }

        case CommandType._whisperToPrevious: {
            if (lastWhisperedUser) {
                chat_command(CommandType._whisper, `${lastWhisperedUser} ${arg}`)
                return;
            }
            console_out(color('You haven\'t whispered to someone yet', 'yellow'));
            break;
        }

        case CommandType._rename: {
            user.changeNickName(arg)
            socket.emit('server_request', { type: CommandType._rename , newNickname: user.nickname });
            break;
        }

        case CommandType._toggle_notifications: {
            receivingNotifications = !receivingNotifications;
            if (receivingNotifications) {
                console_out(color('Notifications turned ON', 'yellow'));
                return;
            }
            console_out(color('Notifications turned OFF', 'red'));
            break;
        }
        case CommandType._roll: {
            if (arg && !isNaN(arg) && arg > 0) {
                rollDice(arg);
            } else {
                rollDice(1);
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
        }
        default:
            showAvailableCommands();
    }
}

socket.on('message', data => {
    switch (data.type) {
        case MessageType._chat: {
            if (data.nick != user.fullname) {
                const leader = color("<" + data.nick + "> ", "green");
                console_out(color(leader + data.message, 'magenta'));
                notify(receivingNotifications,`${data.message}`, `${data.nick} says:`)
            }
            break;
        }
        case MessageType._whisper:{
            const { senderFullName, message } = data;
            const msg = `${senderFullName} whispers to you: ${message}`;
            console_out(color(msg, 'magenta'));
            notify(receivingNotifications,`${message}`, `${senderFullName} whispers... :`)
            break;
        }
        case MessageType._notice: {
            console_out(color(data.message, 'cyan'));
            if (data.nick && data.nick != user.fullname) {
                notify(receivingNotifications,data.message, `New Notification`)
            }
            break;
        }
        case MessageType._tfs: {
            const message = `   TFS WorkItem suggested by ${data.nick}:\n   http://teamfs2010:8080/tfs/DefaultCollection/CBS_UFE/_workitems?id=${data.tfsNumber}`;
            console_out(color(message, 'yellow'));
            if (data.nick != user.fullname) {
                notify(receivingNotifications,`${data.nick} provided link for TFS: ${message}`, 'TFS Link posted')
            }
            break;
        }
        case MessageType._error: {
            const { message } = data;
            console_out(color(message, 'red'));
            notify(true,message,'ERROR')
            break;
        }
        case MessageType._serverCommand: {
            executeServerCommand(data);
            break;
        }
        default:
            null;
    }
});

function User(nickname = null) {
    this.computerName = computerName;
    this.nickname = nickname;
    this.fullname = computerName + ' - ' + nickname;
    this.changeNickName = function (newNickName) {
        this.nickname = newNickName;
        this.fullname = computerName + ' - ' + newNickName;
    }
}

function rollDice(numberOfDice) {
    let dice = [];
    let result = 0;
    let msg = '';
    
    for (let i = 0; i < numberOfDice; i++){
        const roll = Math.floor(Math.random() * 6) + 1;
        dice.push(roll);
        result += roll
    }
    const diceRolledString = dice.reduce((total, num) =>{
        return total +`[${num}]`
    }, '')
    
    if (numberOfDice > 1) {
        msg = `${user.fullname} rolled ${result} with ${numberOfDice} dice from ${diceRolledString}`
    } else {
        msg = `${user.fullname} rolled ${result} with 1 die`
    }
    
    socket.emit('send', { type: MessageType._notice, message: msg });
}
