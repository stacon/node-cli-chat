'use strict';
const {MessageType, color} = require('./src/common.js'),
    {clientInit, introMessage, chat_command, executeServerCommand, raiseNotification, User} = require('./src/clientFunctions/'),
    {console_out, rl, socket} = clientInit;

const user = new User();

rl.question("Please enter a nickname: ", name => {
    user.changeNickName(name);
    socket.emit('connectAnnounce', {type: 'event', user});
    console_out(color(introMessage, 'yellow'));
    rl.prompt(true);
});

rl.on('line', line => {
    if (line[0] === "/" && line.length > 1) {
        const cmd = line.match(/[A-z]+\b/)[0].toLowerCase();
        const arg = line.substr(cmd.length + 2, line.length);
        chat_command({user, cmd, arg});

    } else {
        // send chat message
        socket.emit('send', {type: 'chat', message: line, nick: user.fullname});
        rl.prompt(true);
    }
});


socket.on('message', data => {
    switch (data.type) {
        case MessageType._chat: {
            if (data.nick !== user.fullname) {
                const leader = color("<" + data.nick + "> ", "green");
                console_out(color(leader + data.message, 'magenta'));
                raiseNotification(user.receivingNotifications, `${data.message}`, `${data.nick} says:`)
            }
            break;
        }
        case MessageType._whisper: {
            const {senderFullName, message} = data;
            const msg = `${senderFullName} whispers to you: ${message}`;
            console_out(color(msg, 'magenta'));
            raiseNotification(user.receivingNotifications, `${message}`, `${senderFullName} whispers... :`);
            break;
        }
        case MessageType._notice: {
            console_out(color(data.message, 'cyan'));
            if (data.nick && data.nick !== user.fullname) {
                raiseNotification(user.receivingNotifications, data.message, `New Notification`)
            }
            break;
        }
        case MessageType._tfs: {
            const message = `   TFS WorkItem suggested by ${data.nick}:\n   http://teamfs2010:8080/tfs/DefaultCollection/CBS_UFE/_workitems?id=${data.tfsNumber}`;
            console_out(color(message, 'yellow'));
            if (data.nick !== user.fullname) {
                raiseNotification(user.receivingNotifications, `${data.nick} provided link for TFS: ${message}`, 'TFS Link posted')
            }
            break;
        }
        case MessageType._error: {
            const {message} = data;
            console_out(color(message, 'red'));
            raiseNotification(true, message, 'ERROR');
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
